<?php
/*
 * en esta clase se almacena la conexión a la base de datos (cuyos datos de 
 * configuración se establecen en el fichero conf/dataBase.json). 
 * Contiene métodos para ejecutar consultas, actualizaciones, 
 * salvar objetos a la base de datos, hacer logs de los accesos a la base 
 * de datos con error, así como el manejo de transacciones.
 */
class DataBase {

    private static $mysqli;
    public $queries = [];
    private $config = [];
    public $schema;
    public $error;
    public $errno;

    public function __construct() {
        $this->config = (array) json_decode(file_get_contents('conf/dataBase.json'));
        $this->schema = $this->config['db'];
        if (!self::$mysqli) {
            self::$mysqli = new mysqli($this->config['host'], $this->config['user'], $this->config['password'], $this->config['db']);
            if (self::$mysqli->connect_errno) {
                printf("Falló la conexión: %s\n", self::$mysqli->connect_error);
                exit();
            }
        }
        self::$mysqli->set_charset('utf8');
    }

    public function __destruct() {
        self::$mysqli->close();
    }

    public function lastError() {
        return(self::$mysqli->error);
    }

    public function lastId() {
        return self::$mysqli->insert_id;
    }

    private function refValues($arr) {
        $refs = array();
        foreach ($arr as $key => $value) {
            $refs[$key] = &$arr[$key];
        }
        return $refs;
    }

    private function query($query, $params = [], $hasResult = false) {
        $this->saveQuery($query, $params);
        if (empty($params)) {
            return self::$mysqli->query($query);
        }

        $this->saveQuery($query, $params);
        $stmt = self::$mysqli->prepare($query);

        if (self::$mysqli->error) {
            $this->errno = self::$mysqli->errno;
            $this->error = self::$mysqli->error;
            $this->log();
            return false;
        }

        $types = '';
        foreach ($params as $param) {
            if (is_int($param)) {
                $types .= 'i';
            } else if (is_double($param)) {
                $types .= 'd';
            } else {
                $types .= 's';
            }
        }
        array_unshift($params, $types);

        call_user_func_array([$stmt, 'bind_param'], $this->refValues($params));
        $result = $stmt->execute();

        if (self::$mysqli->error) {
            $this->errno = self::$mysqli->errno;
            $this->error = self::$mysqli->error;
            $this->log();
            return false;
        }
        if (!$hasResult) {
            return $result;
        }
        return $stmt->get_result();
    }

    private function log() {

        $dir = 'logs' . DIRECTORY_SEPARATOR . 'db';
        if (!is_dir($dir)) {
            mkdir($dir, 0777, TRUE);
        }
        $file = $dir . DIRECTORY_SEPARATOR . date('Y_m_d') . '.log';
        ob_start();
        debug_print_backtrace();
        $debug = ob_get_clean();
        $text = date('Y-m-d H:i:s') . "\n
            Error: ({$this->errno}) {$this->error}\n
            Querie: {$this->queries[count($this->queries) - 1]}\n
            Trace:\n
            {$debug}
            \n\n
            ";
        file_put_contents($file, $text, FILE_APPEND);
    }

    private function saveQuery($query, $params) {
        foreach ($params as $param) {
            $query = preg_replace('/\?/', $param, $query, 1);
        }
        $this->queries[] = $query;
    }

    public function select($query, $params = []) {
        $result = $this->query($query, $params, TRUE);
        if ($result === FALSE) {
            return FALSE;
        }
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function selectOne($query, $params = []) {
        $result = $this->query($query, $params, TRUE);
        if ($result === FALSE) {
            return FALSE;
        }
        $array = $result->fetch_all(MYSQLI_ASSOC);
        if ($array === FALSE) {
            return FALSE;
        }
        if (count($array) === 0) {
            return [];
        }
        return $array[0];
    }

    public function modify($query, $params = []) {
        $result = $this->query($query, $params);
        if ($result === FALSE) {
            return FALSE;
        }
        return TRUE;
    }

    public function insert($tableName, $object) {
        if (is_object($object)) {
            $object = (array) $object;
        }
        $query = 'INSERT INTO ' . $tableName . ' (';
        $values = ' VALUES (';
        $params = [];
        foreach ($object as $column => $value) {
            $query .= $column . ', ';
            if ($value === 'null' || $value === 'NULL' || $value === NULL) {
                $values .= 'null, ';
            } else {
                $values .= '?, ';
                $params[] = $value;
            }
        }

        $query = trim($query, ', ');
        $values = trim($values, ', ');

        $query .= ') ' . $values . ')';

        if ($this->modify($query, $params)) {
            return self::$mysqli->insert_id;
        } else {
            return FALSE;
        }
    }

    public function update($tableName, $object, $idName) {
        if (is_object($object)) {
            $object = (array) $object;
        }
        $query = 'UPDATE ' . $tableName . ' SET ';
        $id = $object[$idName];
        unset($object[$idName]);
        $params = [];

        foreach ($object as $column => $value) {
            if ($value === 'null' || $value === 'NULL' || $value === NULL) {
                $query .= ' ' . $column . ' = null, ';
            } else {
                $query .= ' ' . $column . ' = ?, ';
                $params[] = $value;
            }
        }
        $query = trim($query, ', ');
        $query .= ' WHERE ' . $idName . ' =  ?';
        $params[] = $id;

        if ($this->modify($query, $params)) {
            return $id;
        } else {
            return FALSE;
        }
    }

    public function save($tableName, $object, $idName) {
        if (is_object($object)) {
            $object = (array) $object;
        }
        if (key_exists($idName, $object) === FALSE) {
            $id = $this->insert($tableName, $object);
        } elseif (empty($object[$idName])) {
            unset($object[$idName]);
            $id = $this->insert($tableName, $object);
        } else {
            $id = $this->update($tableName, $object, $idName);
        }
        if ($id) {
            return $id;
        } else {
            return false;
        }
        return $this->lastId();
    }

    public function startTrans() {
        self::$mysqli->begin_transaction();
    }

    public function endTrans() {

        if ($this->error) {
            self::$mysqli->rollback();
            return false;
        } else {
            self::$mysqli->commit();
            return true;
        }
    }

    public function getError($objeto) {
        $errno = (int) $this->errno;
        $error = $this->error;
        $erArray = explode("'", $error);
        switch ($errno) {
            case 1062:
                return "Ya existe un/a {$objeto} como ese en la base de datos";
            case 1048:
                return "El campo {$erArray[1]} es obligatorio";
            case 1406:
                return "El campo {$erArray[1]} es demasiado largo";
        }
        return 'Error desconocido de base de datos';
    }

}
