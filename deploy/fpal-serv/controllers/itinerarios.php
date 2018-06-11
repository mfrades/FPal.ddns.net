<?php
/*
 * La clase itinerarios hereda de la clase Controller y se instancia cuando se 
 * van a llevar a cabo acciones sobre las cualificaciones profesionales 
 * asociadas al itinerario formativo de un usuario (por lo que almacena un 
 * apuntador al usuario al que se refiere). Lleva a cabo, a través de la 
 * referencia a la base de datos y al array de errores las transacciones 
 * relacionadas con los itinerarios y sus elementos (cualificaciones 
 * profesionales), la transformación de los datos entre json e instancias de la 
 * clase dbCompetencia cuando resulta necesario. 
 */
class itinerarios extends Controller {

    public $user;

    public function __construct() {
        parent::__construct();
        if (empty($GLOBALS['SESSION']['user'])) {
            $this->response(json_encode(['No ha iniciado sesión']), 500);
        }
        $this->user = $GLOBALS['SESSION']['user'];
    }

    public function get($userId) {
        if (!$user = (new user())->get($userId)) {
            $this->addError(404, 'No se encuentra el Alumno');
            return FALSE;
        }

        if (!in_array('Alumno', $user->tipo)) {
            $this->addError(404, 'No se encuentra el Alumno');
            return FALSE;
        }

        $cualificaciones = self::$dataBase->select("SELECT * FROM cualificacion c
            JOIN itinerario i ON i.cualificacion = c.codigo
            WHERE i.userId = ?", [$user->userId]);

        $cualificaciones = $cualificaciones ? $cualificaciones : [];
        $itinerario = [];

        foreach ($cualificaciones as $cualif) {
            $itinerario[] = [
                'itinerarioId' => $cualif['itinerarioId'],
                'userId' => $cualif['userId'],
                'cualificacion' => $cualif['codigo'],
                'terminada' => $cualif['terminada'],
                'fechaFin' => $cualif['fechaFin'],
                'fechaAdd' => $cualif['fechaAdd'],
                'orden' => $cualif['orden'],
                'cualificacionO' => [
                    'codigo' => $cualif['codigo'],
                    'codigo' => $cualif['codigo'],
                    'nivel' => $cualif['nivel'],
                    'nombre' => $cualif['nombre'],
                    'familia' => $cualif['familia'],
                    'descripcion' => $cualif['descripcion']
                ]
            ];
        }
        return $itinerario;
    }

    public function set() {
        $itinerarios = json_decode(file_get_contents("php://input"));
        if ($mover = filter_input(INPUT_GET, 'mover', FILTER_VALIDATE_BOOLEAN)) {
            return $this->mover($itinerarios);
        }
        if (!is_array($itinerarios)) {
            $this->addError(500, 'Error al guardar el itinerario. Consulte al Administrador.');
            return FALSE;
        }

        self::$dataBase->startTrans();
        $itins = [];
        foreach ($itinerarios as $itinerario) {
            unset($itinerario->terminada);
            unset($itinerario->fechaFin);
            unset($itinerario->fechaAdd);
            unset($itinerario->userAdd);

            $i = new dbitinerario();
            $i->setObject($itinerario);
            if (empty($itinerario->itinerarioId)) {
                $i->fechaAdd = date('Y-m-d H:i:s');
                $i->userAdd = $this->user->userId;
            }
            $i->save();
            $itins[] = $i->getObject();
        }
        if (self::$dataBase->endTrans()) {
            return $itins;
        } else {
            $this->addError(500, self::$dataBase->getError('Itinerario'));
            return FALSE;
        }
    }

    public function mover($itinerarios) {
        if (!is_array($itinerarios) || count($itinerarios) != 2) {
            $this->addError(500, 'Error al guarda el itinerario. Consulte al Administrador.');
            return FALSE;
        }

        self::$dataBase->startTrans();

        foreach ($itinerarios as $i => $itinerario) {
            unset($itinerario->terminada);
            unset($itinerario->fechaFin);
            unset($itinerario->fechaAdd);
            $itin = new dbitinerario();
            $itin->setObject($itinerario);
            $itinerarios[$i] = $itin;
        }

        $itinA = $itinerarios[0];
        $orden = $itinA->orden;
        $itinB = $itinerarios[1];

        $itinA->orden = 0;
        $itinA->save();
        $itinB->save();
        $itinA->orden = $orden;
        $itinA->save();

        if (self::$dataBase->endTrans()) {
            return [];
        } else {
            $this->addError(500, self::$dataBase->getError('Itinerario'));
            return FALSE;
        }
    }

    public function end($itinerarioId) {
        if (!$itinerarioId = filter_var($itinerarioId, FILTER_VALIDATE_INT)) {
            $this->addError(404, 'No se encuentra el Itinerario');
            return FALSE;
        }
        $itinerario = new dbitinerario();
        if (!$itinerario->getFromDB($itinerarioId)) {
            $this->addError(404, 'No se encuentra el Itinerario');
            return FALSE;
        }
        if ($itinerario->terminada) {
            return [$itinerario->getObject()];
        }

        $itinerario->terminada = 1;
        $itinerario->fechaFin = date('Y-m-d H:i:s');

        $alumno = new dbuser();
        $alumno->getFromDB($itinerario->userId);
        $cualificacion = new dbcualificacion();
        $cualificacion->getFromDB($itinerario->cualificacion);

        $message = new dbmessage();
        $message->senderId = $itinerario->userId;
        $message->receiverId = $itinerario->userAdd;
        $message->subject = "Estudio Finalizado - " . $alumno->nombre . " " . $alumno->apellido;
        $message->body = $alumno->nombre . " " . $alumno->apellido . " ha concluido sus estudios de:\n"
                . "\t- " . $cualificacion->nombre;

        self::$dataBase->startTrans();
        $itinerario->save();
        $message->save();
        if (self::$dataBase->endTrans()) {
            return [$itinerario->getObject()];
        } else {
            $this->addError(500, 'Error al guardar el itinerario. Consulte al Administrador.');
            return FALSE;
        }
    }

    public function delete($itinerarioId) {
        if (!$itinerarioId = filter_var($itinerarioId, FILTER_VALIDATE_INT)) {
            $this->addError(404, 'No se encuentra el Itinerario');
            return FALSE;
        }
        $itinerario = new dbitinerario();
        if (!$itinerario->getFromDB($itinerarioId)) {
            $this->addError(404, 'No se encuentra el Itinerario');
            return FALSE;
        }
        if ($itinerario->delete()) {
            return true;
        } else {
            $this->addError(500, 'Error al borrar el itinerario. Consulte al Administrador.');
            return FALSE;
        }
    }

}
