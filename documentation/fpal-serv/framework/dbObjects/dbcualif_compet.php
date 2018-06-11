
<?php
/*
 * La clase dbCualificacionCompetencia hereda de la clase 
 * dbObject. Particulariza la función format de dicha 
 * clase abstracta con el formato de los campos propios 
 * de un tipo de una relación entre cualificaciones y 
 * competencias epresentada en la base de datos. 
 * También proporciona atributos para almacenar en 
 * memoria los datos propios del tipo de dicha relación, 
 * así como la información sobre la tabla en la que se 
 * almacenan estas relaciones dentro de la base de datos 
 * y el nombre del atributo que actúa como identificador 
 * de estos elementos.
 */
Class dbcualif_compet extends dbObject{

    public $tablename = 'cualif_compet';
    public $idName = 'cualifCompetId';

    public $cualifCompetId;
    public $cualificacion;
    public $competencia;

    function format(){
        return [
            'cualifCompetId' => ['PRIMARY_KEY' => TRUE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'int', 'MAX_LENGTH' => NULL],
            'cualificacion' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'string', 'MAX_LENGTH' => 45],
            'competencia' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'string', 'MAX_LENGTH' => 45]
        ];
    }
}