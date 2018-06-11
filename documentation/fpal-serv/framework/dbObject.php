<?php
/*
 * se trata de una clase abstracta que hace de puente entre los datos 
 * que vienen del cliente (que parsea mediante el método getFromPost) 
 * y los datos que vienen de la base de datos, que obtiene mediante 
 * el método getFromDB. Se encarga de almacenar, validar, 
 * modificar y eliminar los objetos en la base de datos. 
 * Todos los objetos que se almacenan en la base de datos heredan 
 * de esta clase.
 */
spl_autoload_register(function($class) {
    $ruta = __DIR__ . '/dbObjects/' . $class . '.php';
    if (file_exists($ruta)) {
        include_once $ruta;
    }
});

abstract class dbObject {

    public $tablename = 'prueba';
    public $idName = 'pruebaId';
    public static $dataBase = null;
    protected $format;
    public $errors = [];

    public function __construct() {
        $this->format = $this->format();
    }

    public static function setDataBase(\DataBase $dataBase) {
        if (!self::$dataBase) {
            self::$dataBase = $dataBase;
        }
    }

    private function setError($type, $data) {
        $this->errors[] = ['type' => $type, 'data' => $data];
    }

    abstract protected function format();

    public static function createClasses() {
        $dir = __DIR__ . '/dbObjects';
        if (!is_dir($dir)) {
            mkdir($dir);
        } else {
            Files::deleteDir($dir, false);
        }
        $schema = self::$dataBase->schema;
        $tables = self::$dataBase->select("
SELECT  *
FROM    information_schema.tables
WHERE   table_schema = ?", [$schema]);

        foreach ($tables as $table) {
            $fileName = $dir . '/db' . $table['TABLE_NAME'] . '.php';
            $columns = self::$dataBase->select("
SELECT
  *
FROM information_schema.columns
WHERE table_schema = ?
AND table_name = ?", [$schema, $table['TABLE_NAME']]);

            $idName = '';
            $properties = '';
            $propArray = '';
            foreach ($columns as $column) {
                if ($column['COLUMN_KEY'] === 'PRI') {
                    $idName = $column['COLUMN_NAME'];
                }
                $properties .= "
    public \${$column['COLUMN_NAME']};";

                $type = '';
                switch (mb_strtolower($column['DATA_TYPE'])) {
                    case 'int':
                    case 'date':
                    case 'time':
                    case 'datetime':
                        $type = $column['DATA_TYPE'];
                        break;
                    case 'char':
                    case 'varchar':
                        $type = 'string';
                        break;
                    case 'double':
                    case 'float';
                    case 'decimal';
                        $type = 'float';
                        break;
                    case 'bit':
                    case 'tinyint':
                    case 'boolean':
                        $type = 'boolean';
                        break;
                }
                $propArray .= "
            '{$column['COLUMN_NAME']}' => ['PRIMARY_KEY' => " . ($column['COLUMN_KEY'] === 'PRI' ? 'TRUE' : 'FALSE') . ","
                        . " 'IS_NULLABLE' => " . ($column['IS_NULLABLE'] === 'YES' ? 'TRUE' : 'FALSE') . ","
                        . " 'DATA_TYPE' => '{$type}',"
                        . " 'MAX_LENGTH' => " . ($column['CHARACTER_MAXIMUM_LENGTH'] ? $column['CHARACTER_MAXIMUM_LENGTH'] : 'NULL') . "],";
            }
            $propArray = trim($propArray, ',');


            $fileTEXT = "
<?php

Class db" . $table['TABLE_NAME'] . " extends dbObject{

    public \$tablename = '{$table['TABLE_NAME']}';
    public \$idName = '{$idName}';
{$properties}

    function format(){
        return [{$propArray}
        ];
    }
}";

            echo $table['TABLE_NAME'] . ': ' . file_put_contents($fileName, $fileTEXT) . " bytes\n";
        }
        header('Content-Type: text');
        return true;
    }

    public function setObject($object) {
        foreach ($object as $property => $value) {
            if (key_exists($property, $this->format)) {
                $this->$property = $value;
            }
        }
    }

    public function getFromPost() {
        $object = [];
        $errors = [];
        foreach ($this->format as $property => $format) {
            if (!key_exists($property, $_POST)) {
                continue;
            }
            switch (mb_strtolower($format['DATA_TYPE'])) {
                case 'int':
                    $result = $this->$property = filter_input(INPUT_POST, $property, FILTER_VALIDATE_INT);
                    break;
                case 'string':
                case 'date':
                case 'time':
                case 'datetime':
                    $result = filter_input(INPUT_POST, $property);
                    break;
                case 'float';
                    $result = filter_input(INPUT_POST, $property, FILTER_VALIDATE_FLOAT, ['flags' => FILTER_FLAG_ALLOW_FRACTION]);
                    break;
                case 'boolean':
                    $result = filter_input(INPUT_POST, $property, FILTER_VALIDATE_BOOLEAN, ['flags' => FILTER_NULL_ON_FAILURE]);
                    if ($result !== null) {
                        $this->$property = $result;
                    }
                    return true;
            }
            if ($result !== FALSE && $result !== NULL) {
                $this->$property = $result;
            }
        }

        return true;
    }

    public function getFromDB($id) {
        if (!$object = self::$dataBase->selectOne('SELECT * FROM ' . $this->tablename . ' WHERE ' . $this->idName . ' = ?', [$id])) {
            return FALSE;
        }
        $this->setObject($object);
        return true;
    }

    public function getObject() {
        $object = new stdClass();
        foreach ($this->format as $property => $format) {
            if (isset($this->$property)) {
                $object->$property = $this->$property;
            }
        }
        return $object;
    }

    public function save() {
        $object = $this->getObject();
        $idName = $this->idName;
        if ($id = self::$dataBase->save($this->tablename, $object, $idName)) {
            $this->$idName = $id;
            return true;
        }
        return false;
    }

    public function insert() {
        $object = $this->getObject();
        if ($id = self::$dataBase->insert($this->tablename, $object)) {
            $this->$idName = $id;
            return true;
        }
        return false;
    }

    public function update() {
        $object = $this->getObject();
        $idName = $this->idName;
        if ($id = self::$dataBase->update($this->tablename, $object, $idName)) {
            $this->$idName = $id;
            return true;
        }

        return false;
    }

    public function validar($format, $messages) {
        $formatObj = $this->format();
        $format = array_merge($formatObj, $format);
        foreach ($formatObj as $column => $form) {
            if (key_exists($column, $format)) {
                $format[$column] = array_merge($form, $format[$column]);
            } else {
                $format[$column] = $form;
            }
        }

        $errors = [];
        foreach ($format as $column => $form) {
            $value = $this->$column;
            $errors[$column] = [];
            foreach ($form as $prop => $limit) {
                switch ($prop) {
                    case 'IS_NULLABLE':
                        if (!$limit && empty($value)) {
                            $errors[$column][] = 'IS_NULLABLE';
                        }
                        break;
                    case 'DATA_TYPE':
                        if ($value) {
                            switch ($limit) {
                                case 'int':
                                    if (!filter_var($value, FILTER_VALIDATE_INT)) {
                                        $errors[$column][] = 'DATA_TYPE';
                                    }
                                    break;
                                case 'float':
                                    if (!filter_var($value, FILTER_VALIDATE_FLOAT)) {
                                        $errors[$column][] = 'DATA_TYPE';
                                    }
                                    break;
                                case 'boolean':
                                    if (!filter_var($value, FILTER_VALIDATE_BOOLEAN)) {
                                        $errors[$column][] = 'DATA_TYPE';
                                    }
                                    break;
                                case 'string':
                                    $this->$column = filter_var($value, FILTER_SANITIZE_STRING);
                                    break;
                            }
                        }
                        break;
                    case 'MAX_LENGTH':
                        if ($value && $limit && is_string($value) && strlen($value) > $limit) {
                            $errors[$column][] = 'MAX_LENGTH';
                        }
                        break;
                    case 'MIN_LENGTH':
                        if ($limit && is_string($value) && strlen($value) < $limit) {
                            $errors[$column][] = 'MIN_LENGTH';
                        }
                        break;
                    case 'EMAIL':
                        if ($limit && is_string($value) && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                            $errors[$column][] = 'EMAIL';
                        }
                        break;
                    case 'PATTERN':
                        if ($limit && is_string($value) && !preg_match($limit, $value)) {
                            $errors[$column][] = 'PATTERN';
                        }
                        break;
                }
            }
            if (empty($errors[$column])) {
                unset($errors[$column]);
            }
        }

        $errorMess = [];
        foreach ($errors as $column => $errs) {
            foreach ($errs as $error) {
                $found = false;
                if (key_exists($column, $messages)) {
                    if (key_exists($error, $messages[$column])) {
                        $errorMess[] = $messages[$column][$error];
                        $found = true;
                    }
                }
                if (!$found) {
                    $errorMess[] = "El campo {$column} no cumple los requisitos";
                }
            }
        }
        return $errorMess;
    }

    public function delete() {
        $idName = $this->idName;
        if (!$this->$idName) {
            return false;
        }
        return self::$dataBase->modify("DELETE FROM {$this->tablename} WHERE {$idName} = ?", [$this->$idName]);
    }

}
