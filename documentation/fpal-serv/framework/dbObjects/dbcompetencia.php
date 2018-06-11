
<?php
/*
 * La clase dbcompetencia hereda de la clase dbObject.
 * Particulariza la función format con el formato de los
 * campos propios de una competencia profesional 
 * representada en la base de datos. También proporciona
 * atributos para almacenar en memoria los datos propios
 * de la competencia profesional, así como la información
 * sobre la tabla en la que se almacenan las competencias 
 * profesionales dentro de la base de datos y el nombre
 * del atributo que actúa como identificador de estos 
 * elementos.
 */
Class dbcompetencia extends dbObject{

    public $tablename = 'competencia';
    public $idName = 'codigo';

    public $codigo;
    public $nivel;
    public $nombre;
    public $medios;
    public $productos;
    public $informacion;
    public $realizaciones;

    function format(){
        return [
            'codigo' => ['PRIMARY_KEY' => TRUE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'string', 'MAX_LENGTH' => 45],
            'nivel' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'int', 'MAX_LENGTH' => NULL],
            'nombre' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'string', 'MAX_LENGTH' => 255],
            'medios' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => TRUE, 'DATA_TYPE' => 'string', 'MAX_LENGTH' => 2000],
            'productos' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => TRUE, 'DATA_TYPE' => 'string', 'MAX_LENGTH' => 2000],
            'informacion' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => TRUE, 'DATA_TYPE' => 'string', 'MAX_LENGTH' => 2000],
            'realizaciones' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => TRUE, 'DATA_TYPE' => 'string', 'MAX_LENGTH' => 10000]
        ];
    }
}