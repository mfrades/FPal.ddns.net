<?php
/*
 * La clase user hereda de la clase Controller y se instancia cuando se van a 
 * llevar a cabo acciones relacionadas con el control de usuarios (por ejemplo, 
 * la validación de los campos proporcionados en el registro, la actualización 
 * de la información correspondiente comprobando los permisos…). Para ello, 
 * instancia la clase dbUser cuando es necesario y accede a la base de datos 
 * para actualizar sus atributos o bien actualiza la base de datos, según 
 * corresponda.
 */
Class user Extends Controller {

    public $user = null;

    public function __construct() {
        parent::__construct();
        if (!empty($GLOBALS['SESSION']['user'])) {
            $this->user = $GLOBALS['SESSION']['user'];
        }
    }

    public function messageValidation() {
        return [
            'email' => [
                'NOT_NULLABLE' => 'El email no tiene un formato válido',
                'EMAIL' => 'El email no tiene un formato válido'
            ],
            'passwd' => [
                'NOT_NULLABLE' => 'La contraseña debe tener una mayúscula, una minúscula, un número y 8-20 caracteres',
                'PATTERN' => 'La contraseña debe tener una mayúscula, una minúscula, un número y 8-20 caracteres'
            ],
            'formacion' => [
                'MAX_LENGTH' => 'El tamaño máximo de la formación es de 3000 caracteres'
            ],
            'intereses' => [
                'MAX_LENGTH' => 'El tamaño máximo de los intereses es de 3000 caracteres'
            ],
            'perspectivas' => [
                'MAX_LENGTH' => 'El tamaño máximo de las perspectivas es de 3000 caracteres'
            ]
        ];
    }

    //CREAR NUEVO USUARIO
    public function save($userId = null) {
        //RECOGIDA DE VALORES
        $user = new dbuser();
        $nuevo = false;
        $editar = false;
        $editarPropio = false;
        if ($userId) {
            $editar = true;
            if (empty($this->user)) {
                $this->addError(500, 'No tiene permisos para editar el usuario.');
                return FALSE;
            }
            $userId = filter_var($userId, FILTER_VALIDATE_INT);
            if (!$user->getFromDB($userId)) {
                $this->addError(500, 'No se encuentra el usuario');
                return FALSE;
            }
            if ($userId = $this->user->userId) {
                $editarPropio = true;
            }
        } else {
            $nuevo = true;
            if (!empty($this->user)) {
                $this->addError(500, 'No tiene permisos para editar el usuario.');
                return FALSE;
            }
            $user->tipo = ['Alumno'];
        }

        $user->getFromPost();
        $user->repasswd = filter_input(INPUT_POST, 'repasswd', FILTER_SANITIZE_STRING);
        if (empty($user->fechaAdd)) {
            $user->fechaAdd = date('Y-m-d H:i:s');
        }

        function cleanURL($string) {
            $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.
            return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
        }

        if (!empty($_FILES['foto']) && empty($_FILES['foto']['error'])) {
            $foto = $_FILES['foto'];
            $info = pathinfo($foto['name']);
            $fileName = 'files/' . cleanURL($info['filename']) . '.' . mb_strtolower($info['extension']);
            $cont = 0;
            while (file_exists($fileName)) {
                $fileName = 'files/' . cleanURL($info['filename']) . '_' . $cont++ . '.' . mb_strtolower($info['extension']);
            }
            rename($foto['tmp_name'], $fileName);
            $user->foto = $fileName;
        } elseif (strpos($user->foto, self::$routing->host) !== false) {
            unset($user->foto);
        }

        //VALIDACIÓN DE CAMPOS
        $valErrors = [];
        if (!empty($user->passwd) && ($user->passwd !== $user->repasswd)) {
            $valErrors[] = "Las contraseñas no son idénticas";
        }

        $user->setObject($user);
        $format = [
            'passwd' => ['PATTERN' => '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/'],
            'email' => ['EMAIL' => TRUE]
        ];
        if ($editar) {
            $format['passwd'] = ['IS_NULLABLE' => TRUE];
        } else {
            $format['userId'] = ['IS_NULLABLE' => TRUE];
        }
        $valErrors = array_merge($valErrors, $user->validar($format, $this->messageValidation()));
        if (!empty($valErrors)) {
            $this->addError(401, $valErrors);
            return false;
        }

        //GUARDADO EN BASE DE DATOS
        if (empty($user->passwd)) {
            unset($user->passwd);
            unset($user->repasswd);
        } else {
            $user->passwd = password_hash($user->passwd, PASSWORD_DEFAULT);
        }

        self::$dataBase->startTrans();
        if ($user->save()) {
            if (!empty($user->tipo) && $user->userId) {
                if (!empty($user->userId)) {
                    self::$dataBase->modify("DELETE FROM usertype WHERE userId = ?", [$user->userId]);
                }
                foreach ($user->tipo as $tipo) {
                    $dbtipo = new dbusertype();
                    $dbtipo->setObject([
                        'userId' => $user->userId,
                        'type' => $tipo
                    ]);
                    $dbtipo->save();
                }
            }
        }
        self::$dataBase->endTrans();

        if (self::$dataBase->errno) {
            $this->addError(500, self::$dataBase->getError('usuario'));
            return FALSE;
        } else {
            return $user;
        }
    }

    public function get($userId = null) {
        if (!$userId = filter_var($userId, FILTER_VALIDATE_INT)) {
            $this->addError(404, 'No se encuentra el usuario');
            return false;
        }
        $user = new dbuser();
        if (!$user->getFromDB($userId)) {
            $this->addError(404, 'No se encuentra el usuario');
            return FALSE;
        }

        if ($user->foto) {
            $user->foto = self::$routing->baseURL() . $user->foto;
        }


        $user = $user->getObject();
        $tipos = self::$dataBase->select("SELECT type FROM usertype WHERE userId = ?", [$userId]);
        $user->tipo = array_column($tipos, 'type');

        unset($user->passwd);

        return $user;
    }

    public function getAll() {
        if (!$this->user) {
            $this->addError(500, 'No ha iniciado sesión');
            return false;
        }

        $tipo = filter_input(INPUT_GET, 'tipo');
        $name = filter_input(INPUT_GET, 'name');

        if (count($this->user->tipo) === 1 && $this->user->tipo[0] === 'Alumno') {
            $tipo = 'Formador';
        }

        $sql = "SELECT u.userId, u.email, u.activo, u.foto, u.nombre, u.apellido, u.fechaAdd
                FROM user u";
        $params = [];
        if ($tipo) {
            $sql .= "
                JOIN usertype ut on ut.userId = u.userId
                WHERE ut.type = ?";
            $params[] = $tipo;
        }
        if ($name) {
            $sql .= $tipo ? " AND" : " WHERE";
            $sql .= " CONCAT(u.nombre, ' ', u.apellido) LIKE CONCAT('%',?,'%')";
            $params[] = $name;
        }
        $sql .= ($tipo || $name ? " AND" : " WHERE") . " u.userId <> ?";
        $params[] = $this->user->userId;
        $users = self::$dataBase->select($sql, $params);
        foreach ($users as &$user) {
            if ($user['foto']) {
                $user['foto'] = self::$routing->baseURL() . $user['foto'];
            }
        }
        RETURN $users;
    }

    public function delete($userId) {
        if (!$userId = filter_var($userId, FILTER_VALIDATE_INT)) {
            $this->addError(404, 'No se encuentra el usuario');
            return FALSE;
        }
        $user = new dbuser();
        if (!$user->getFromDB($userId)) {
            $this->addError(404, 'No se encuentra el usuario');
            return FALSE;
        }
        if (!$user->delete()) {
            $this->addError(500, 'Error de BD: ' . self::$dataBase->error);
        }
        return true;
    }

    public function activar($userId) {
        return self::$dataBase->modify("UPDATE user SET activo = (CASE WHEN activo IS NULL THEN 1 ELSE NULL END) WHERE userId = ?", [$userId]);
    }

    public function esFormador($userId) {
        self::$dataBase->modify("DELETE FROM userType WHERE type = 'Alumno' AND userId = ?", [$userId]);
        return self::$dataBase->modify("INSERT INTO userType (userId, type) VALUES (?,'Formador')", [$userId]);
    }

}
