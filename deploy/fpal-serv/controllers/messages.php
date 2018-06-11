<?php
/*
 * La clase messages hereda de la clase Controller y se instancia cuando se van 
 * a llevar a cabo acciones relacionadas con el control de mensajes (envío, 
 * recuperación, borrado). Para ello, instancia la clase dbMessage y accede a la 
 * base de datos para actualizar sus atributos o bien actualiza la base de datos, 
 * según corresponda.
 */

class messages extends Controller {

    public $user;

    public function __construct() {
        parent::__construct();
        if (empty($GLOBALS['SESSION']['user'])) {
            $this->response(json_encode(['No ha iniciado sesión']), 500);
        }
        $this->user = $GLOBALS['SESSION']['user'];
    }

    public function send() {
        $message = new dbmessage();
        $message->setObject(json_decode(file_get_contents("php://input")));
        $message->senderId = $this->user->userId;
        return $message->save();
    }

    public function getAll($sent = null) {

        $tipo = $sent ? 'sender' : 'receiver';
        $return = self::$dataBase->select("SELECT m.messageId, m.senderId, m.receiverId, m.fechaAdd, m.subject, m.body, m.leido,
            CONCAT(ur.nombre, ' ', ur.apellido) AS receiver,
            CONCAT(us.nombre, ' ', us.apellido) AS sender
            FROM message m
            JOIN user ur ON ur.userId = m.receiverId
            JOIN user us ON us.userId = m.senderId
            WHERE {$tipo}Id = ? AND {$tipo}Delete IS NULL
            ORDER BY m.fechaAdd DESC", [$this->user->userId]);

        return $return;
    }

    public function delete($messageId) {
        $message = new dbmessage();
        if (!$message->getFromDB($messageId)) {
            $this->addError(500, 'No se encuentra el mensaje');
            return false;
        }

        $modif = false;
        if ($message->senderId == $this->user->userId) {
            $message->senderDelete = 1;
            $modif = true;
        }
        if ($message->receiverId == $this->user->userId) {
            $message->receiverDelete = 1;
            $modif = true;
        }
        if (!$modif) {
            $this->addError(500, 'No tiene permisos para acceder al mensaje');
            return false;
        }
        return $message->save();
    }

    public function leer($messageId) {
        $message = new dbmessage();
        if (!$message->getFromDB($messageId)) {
            $this->addError(500, 'No se encuentra el mensaje');
            return false;
        }
        if ($message->receiverId !== $this->user->userId) {
            $this->addError(500, 'No puede marcar este mensaje como leido');
            return false;
        }
        $message->leido = 1;
        return $message->save();
    }

}
