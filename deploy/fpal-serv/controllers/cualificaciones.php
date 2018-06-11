<?php
/*
 * La clase cualificaciones hereda de la clase Controller y se instancia cuando 
 * se van a llevar a cabo acciones sobre las cualificaciones profesionales. 
 * Lleva a cabo, a través de la referencia a la base de datos y al array de 
 * errores las transacciones relacionadas con las competencias, la 
 * transformación de los datos de las competencias entre json e instancias de 
 * la clase dbCompetencia cuando resulta necesario. Almacena también información 
 * sobre las familias profesionales
 */
class cualificaciones extends Controller {

    public static $familias = [
        'AFD' => 'Actividades físicas y deportivas',
        'ADG' => 'Administración y gestión',
        'AGA' => 'Agraria',
        'ARG' => 'Artes gráficas',
        'ART' => 'Artes y artesanías',
        'COM' => 'Comercio y marketing',
        'EOC' => 'Edificación y obra civil',
        'ELE' => 'Electricidad y electrónica',
        'ENA' => 'Energía y agua',
        'FME' => 'Fabricación mecánica',
        'HOT' => 'Hostelería y turismo',
        'IMP' => 'Imagen personal',
        'IMS' => 'Imagen y sonido',
        'INA' => 'Industrias alimentarias',
        'IEX' => 'Industrias extractivas',
        'IFC' => 'Informática y comunicaciones',
        'IMA' => 'Instalación y mantenimiento',
        'MAM' => 'Madera, mueble y corcho',
        'MAP' => 'Marítimo pesquera',
        'QUI' => 'Química',
        'SAN' => 'Sanidad',
        'SEA' => 'Seguridad y medio ambiente',
        'SSC' => 'Servicios socioculturales y a la comunidad',
        'TCP' => 'Textil, confección y piel',
        'TMV' => 'Transporte y mantenimiento de vehículos',
        'VIC' => 'Vidrio y cerámica'
    ];

    public function __construct() {
        parent::__construct();
        if (empty($GLOBALS['SESSION']['user'])) {
            $this->response(json_encode(['No ha iniciado sesión']), 500);
        }
        $this->user = $GLOBALS['SESSION']['user'];
    }

    public function get($id = null) {
        if (!$id) {
            $this->addError(404, 'No se encuentra la cualificación profesional');
            return false;
        }
        $cualif = new dbcualificacion();
        if (!$cualif->getFromDB($id)) {
            $this->addError(404, 'No se encuentra la cualificación profesional');
            return false;
        }
        $cualif = $cualif->getObject();
        $competencias = self::$dataBase->select("SELECT c.* FROM cualif_compet cc JOIN competencia c ON c.codigo = cc.competencia WHERE cc.cualificacion = ?", [$cualif->codigo]);

        $cualif->competencias = $competencias ? $competencias : [];
        return $cualif;
    }

    public function getAll() {
        return self::$dataBase->select("SELECT c.* FROM cualificacion c");
    }

    public function set($id = null) {
        $cualif = new dbcualificacion();
        $editar = FALSE;
        if ($id) {
            if ($cualif->getFromDB($id)) {
                $editar = TRUE;
            }
        }

        $cualificacionExt = json_decode(file_get_contents("php://input"));
        $cualif->setObject($cualificacionExt);
        $cualif->codigo = trim($cualif->codigo);
        $competencias = $cualificacionExt->competencias;
        $competenciasIds = array_map(function($object) {
            return is_object($object) ? $object->codigo : $object['codigo'];
        }, $competencias);
        $competenciasIds = array_unique($competenciasIds);

        self::$dataBase->startTrans();
        if ($editar) {
            $cualif->update();
        } else {
            $cualif->insert();
        }
        self::$dataBase->modify('DELETE FROM cualif_compet WHERE cualificacion = ?', [$cualif->codigo]);
        foreach ($competenciasIds as $codigo) {
            $cc = new dbcualif_compet();
            $cc->cualificacion = $cualif->codigo;
            $cc->competencia = $codigo;
            $cc->save();
        }
        self::$dataBase->endTrans();
        if (self::$dataBase->errno) {
            $this->addError(500, self::$dataBase->getError('usuario'));
            return FALSE;
        } else {
            return $cualif;
        }
    }

    public function delete($id = null) {
        if (!$id) {
            $this->addError(404, 'No se encuentra la cualificación profesional');
            return false;
        }
        $cualif = new dbcualificacion();
        if (!$cualif->getFromDB($id)) {
            $this->addError(404, 'No se encuentra la cualificación profesional');
            return false;
        }
        if (!$cualif->delete()) {
            $this->addError(500, 'Error interno consulte al administrador');
            return false;
        }
        return true;
    }

    public function checkId() {
        $id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_STRING);
        $familia = filter_input(INPUT_GET, 'familia', FILTER_SANITIZE_STRING);
        $nivel = filter_input(INPUT_GET, 'nivel', FILTER_VALIDATE_INT);
        $fam = array_search($familia, self::$familias);
        $codigo = $fam . $id . '_' . $nivel;

        if (!$id || !$fam || !$nivel) {
            $this->addError(500, 'Revise los campos que forman el código: identificador, familia, nivel');
            return false;
        }
        $cualif = self::$dataBase->selectOne('SELECT * FROM cualificacion WHERE codigo = ?', [$codigo]);
        if ($cualif) {
            $this->addError(500, 'Ya existe una cualificacion con ese código');
            return false;
        }
        return $codigo;
    }

}
