
<?php
/*
 * La clase dbUserType hereda de la clase dbObject. 
 * Particulariza la función format de dicha clase abstracta 
 * con el formato de los campos propios de un tipo de 
 * usuario representado en la base de datos. También 
 * proporciona atributos para almacenar en memoria los 
 * datos propios del tipo de usuario, así como la 
 * información sobre la tabla en la que se almacenan 
 * los tipos de usuarios dentro de la base de datos y el 
 * nombre del atributo que actúa como identificador de 
 * estos elementos.
 */
Class dbusertype extends dbObject{

    public $tablename = 'usertype';
    public $idName = 'userTypeId';

    public $userTypeId;
    public $userId;
    public $type;

    function format(){
        return [
            'userTypeId' => ['PRIMARY_KEY' => TRUE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'int', 'MAX_LENGTH' => NULL],
            'userId' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'int', 'MAX_LENGTH' => NULL],
            'type' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => '', 'MAX_LENGTH' => 13]
        ];
    }
}