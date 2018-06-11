
<?php
/*
 * La clase dbMessage hereda de la clase dbObject. 
 * Particulariza la función format de dicha clase abstracta
 *  con el formato de los campos propios de un mensaje 
 * representado en la base de datos. También proporciona 
 * atributos para almacenar en memoria los datos propios 
 * del mensaje, así como la información sobre la tabla en 
 * la que se almacenan los mensajes dentro de la base de 
 * datos y el nombre del atributo que actúa como identificador 
 * de estos elementos.
 */
Class dbmessage extends dbObject{

    public $tablename = 'message';
    public $idName = 'messageId';

    public $messageId;
    public $senderId;
    public $receiverId;
    public $fechaAdd;
    public $subject;
    public $body;
    public $senderDelete;
    public $receiverDelete;
    public $leido;

    function format(){
        return [
            'messageId' => ['PRIMARY_KEY' => TRUE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'int', 'MAX_LENGTH' => NULL],
            'senderId' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'int', 'MAX_LENGTH' => NULL],
            'receiverId' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'int', 'MAX_LENGTH' => NULL],
            'fechaAdd' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => FALSE, 'DATA_TYPE' => 'datetime', 'MAX_LENGTH' => NULL],
            'subject' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => TRUE, 'DATA_TYPE' => 'string', 'MAX_LENGTH' => 255],
            'body' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => TRUE, 'DATA_TYPE' => 'string', 'MAX_LENGTH' => 2000],
            'senderDelete' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => TRUE, 'DATA_TYPE' => 'boolean', 'MAX_LENGTH' => NULL],
            'receiverDelete' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => TRUE, 'DATA_TYPE' => 'boolean', 'MAX_LENGTH' => NULL],
            'leido' => ['PRIMARY_KEY' => FALSE, 'IS_NULLABLE' => TRUE, 'DATA_TYPE' => 'boolean', 'MAX_LENGTH' => NULL]
        ];
    }
}