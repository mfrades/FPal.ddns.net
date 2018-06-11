
<?php
/*
 * La clase dbItinerario hereda de la clase dbObject. 
 * Particulariza la función format de dicha clase 
 * abstracta con el formato de los campos propios de un
 *  itinerario profesional representado en la base de 
 * datos. También proporciona atributos para almacenar 
 * en memoria los datos propios del itinerario profesional,
 *  así como la información sobre la tabla en la que se 
 * almacenan los itinerarios profesionales dentro de la 
 * base de datos y el nombre del atributo que actúa como 
 * identificador de estos elementos.
 */
Class dbitinerario extends dbObject{

    public $tablename = 'itinerario';
    public $idName = 'itinerarioId';

    public $itinerarioId;
    public $userId;
    public $cualificacion;
    public $terminada;
    public $fechaFin;
    public $orden;
    public $fechaAdd;
    public $userAdd;

    function format(){
        return [
            'itinerarioId' => ['PRIMARY_KEY' => TRUE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'int', 'MAX_LENGTH' => NULL],
            'userId' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'int', 'MAX_LENGTH' => NULL],
            'cualificacion' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'string', 'MAX_LENGTH' => 45],
            'terminada' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => TRUE, 'DATA_TYPE' => 'boolean', 'MAX_LENGTH' => NULL],
            'fechaFin' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => TRUE, 'DATA_TYPE' => 'datetime', 'MAX_LENGTH' => NULL],
            'orden' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'int', 'MAX_LENGTH' => NULL],
            'fechaAdd' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'datetime', 'MAX_LENGTH' => NULL],
            'userAdd' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'int', 'MAX_LENGTH' => NULL]
        ];
    }
}