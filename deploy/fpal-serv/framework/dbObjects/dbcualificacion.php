
<?php
/*
 * La clase dbCualificacion hereda de la clase dbObject. 
 * Particulariza la función format de dicha clase abstracta 
 * con el formato de los campos propios de una cualificación 
 * profesional representada en la base de datos. 
 * También proporciona atributos para almacenar en memoria 
 * los datos propios de la cualificación profesional, así 
 * como la información sobre la tabla en la que se almacenan 
 * las cualificacioness profesionales dentro de la base de 
 * datos y el nombre del atributo que actúa como 
 * identificador de estos elementos.
 */
Class dbcualificacion extends dbObject{

    public $tablename = 'cualificacion';
    public $idName = 'codigo';

    public $codigo;
    public $nivel;
    public $nombre;
    public $familia;
    public $descripcion;
    public $entorno;

    function format(){
        return [
            'codigo' => ['PRIMARY_KEY' => TRUE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'string', 'MAX_LENGTH' => 45],
            'nivel' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'int', 'MAX_LENGTH' => NULL],
            'nombre' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'string', 'MAX_LENGTH' => 255],
            'familia' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'string', 'MAX_LENGTH' => 255],
            'descripcion' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => TRUE, 'DATA_TYPE' => 'string', 'MAX_LENGTH' => 2000],
            'entorno' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => TRUE, 'DATA_TYPE' => 'string', 'MAX_LENGTH' => 2000]
        ];
    }
}