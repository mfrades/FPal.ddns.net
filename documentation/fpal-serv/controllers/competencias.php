<?php
/*
 *  La clase competencias hereda de la clase Controller y se instancia cuando 
 * se van a llevar a cabo acciones sobre las competencias profesionales.  de la 
 * clase dbObject. Particulariza la función format de dicha clase abstracta con 
 * el formato de los campos propios de un tipo de una relación entre 
 * cualificaciones y competencias representada en la base de datos. 
 * También proporciona atributos para almacenar en memoria los datos propios 
 * del tipo de dicha relación, así como la información sobre la tabla en la que 
 * se almacenan estas relaciones dentro de la base de datos y el nombre del 
 * atributo que actúa como identificador de estos elementos. Lleva a cabo, a 
 * través de la referencia a la base de datos y al array de errores las 
 * transacciones relacionadas con las competencias, la transformación de los 
 * datos de las competencias entre json e instancias de la clase dbCompetencia 
 * cuando resulta necesario.
 */
class competencias extends Controller {

    public function __construct() {
        parent::__construct();
        if (empty($GLOBALS['SESSION']['user'])) {
            $this->response(json_encode(['No ha iniciado sesión']), 500);
        }
        $this->user = $GLOBALS['SESSION']['user'];
    }

    public function get($id = null) {
        if (!$id) {
            $this->addError(404, 'No se encuentra la unidad de competencia');
            return false;
        }
        $compet = new dbcompetencia();
        if (!$compet->getFromDB($id)) {
            $this->addError(404, 'No se encuentra la unidad de competencia');
            return false;
        }
        $compet = $compet->getObject();
        if (!empty($compet->realizaciones)) {
            $compet->realizaciones = json_decode($compet->realizaciones);
        } else {
            $compet->realizaciones = [];
        }
        return $compet;
    }

    public function getAll() {
        $nombre = filter_input(INPUT_GET, 'nombre', FILTER_SANITIZE_STRING);
        if ($nombre) {
            return self::$dataBase->select("SELECT c.codigo, c.nivel, c.nombre FROM competencia c WHERE nombre LIKE CONCAT('%',?,'%')", [$nombre]);
        }
        return self::$dataBase->select("SELECT c.* FROM competencia c");
    }

    public function set($id = null) {

        $compet = new dbcompetencia();
        $editar = false;
        if ($id) {
            if ($compet->getFromDB($id)) {
                $editar = true;
            }
        }
        $competExt = json_decode(file_get_contents("php://input"));
        $competExt->realizaciones = json_encode($competExt->realizaciones);
        $competExt->codigo = trim($competExt->codigo);
        $compet->setObject($competExt);


        self::$dataBase->startTrans();
        if ($editar) {
            $compet->update();
        } else {
            $compet->insert();
        }
        self::$dataBase->endTrans();
        if (self::$dataBase->errno) {
            $this->addError(500, self::$dataBase->getError('usuario'));
            return FALSE;
        } else {
            $compet = $compet->getObject();
            if (!empty($compet->realizaciones)) {
                $compet->realizaciones = json_decode($compet->realizaciones);
            } else {
                $compet->realizaciones = [];
            }
            return $compet;
        }
    }

    public function delete($id = null) {
        if (!$id) {
            $this->addError(404, 'No se encuentra la unidad de competencia');
            return false;
        }
        $compet = new dbcompetencia();
        if (!$compet->getFromDB($id)) {
            $this->addError(404, 'No se encuentra la unidad de competencia');
            return false;
        }

        if (!$compet->delete()) {
            $this->addError(500, 'Error interno consulte al administrador');
            return false;
        }
        return true;
    }

    public function checkId() {
        $id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_STRING);
        $nivel = filter_input(INPUT_GET, 'nivel', FILTER_VALIDATE_INT);
        $codigo = 'UC' . $id . '_' . $nivel;

        if (!$id || !$nivel) {
            $this->addError(500, 'Revise los campos que forman el código: identificador, familia, nivel');
            return false;
        }
        $cualif = self::$dataBase->selectOne('SELECT * FROM competencia WHERE codigo = ?', [$codigo]);
        if ($cualif) {
            $this->addError(500, 'Ya existe una competencia con ese código');
            return false;
        }
        return $codigo;
    }

}
