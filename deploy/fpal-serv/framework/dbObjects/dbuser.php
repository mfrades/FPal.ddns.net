
<?php
/*
 * La clase dbUser hereda de la clase dbObject. 
 * Particulariza la función format de dicha clase 
 * abstracta con el formato de los campos propios de un 
 * usuario representado en la base de datos. 
 * También proporciona atributos para almacenar en 
 * memoria los datos propios del usuario, así como la 
 * información sobre la tabla en la que se almacenan 
 * los usuarios dentro de la base de datos y el nombre 
 * del atributo que actúa como identificador de estos 
 * elementos.
 */
Class dbuser extends dbObject{

    public $tablename = 'user';
    public $idName = 'userId';

    public $userId;
    public $email;
    public $passwd;
    public $formacion;
    public $intereses;
    public $perspectivas;
    public $activo;
    public $foto;
    public $nombre;
    public $apellido;
    public $fechaAdd;

    function format(){
        return [
            'userId' => ['PRIMARY_KEY' => TRUE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'int', 'MAX_LENGTH' => NULL],
            'email' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'string', 'MAX_LENGTH' => 255],
            'passwd' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'string', 'MAX_LENGTH' => 255],
            'formacion' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => TRUE, 'DATA_TYPE' => 'string', 'MAX_LENGTH' => 3000],
            'intereses' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => TRUE, 'DATA_TYPE' => 'string', 'MAX_LENGTH' => 3000],
            'perspectivas' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => TRUE, 'DATA_TYPE' => 'string', 'MAX_LENGTH' => 3000],
            'activo' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => TRUE, 'DATA_TYPE' => 'boolean', 'MAX_LENGTH' => NULL],
            'foto' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => TRUE, 'DATA_TYPE' => 'string', 'MAX_LENGTH' => 255],
            'nombre' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'string', 'MAX_LENGTH' => 255],
            'apellido' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'string', 'MAX_LENGTH' => 255],
            'fechaAdd' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'datetime', 'MAX_LENGTH' => NULL]
        ];
    }
}