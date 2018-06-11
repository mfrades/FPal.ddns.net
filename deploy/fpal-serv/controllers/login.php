<?php
/*
 * La clase login  hereda de la clase Controller y se instancia cuando se van a 
 * llevar a cabo acciones relacionadas con el control de acceso de los usuarios 
 * (autorización y autenticación). Para ello, analiza la sesión actual 
 * determinando si el usuario está o no logado o comprobando los datos de acceso 
 * del usuario que quiere hacer login.
 */
Class login Extends Controller {

    public function __construct() {
        parent::__construct();
    }

    function autoLogin() {
        if (!empty($GLOBALS['SESSION']['user'])) {
            return ['user' => $GLOBALS['SESSION']['user'], 'token' => $GLOBALS['SESSION']['token']];
        } else {
            $this->addError(404, 'No ha iniciado sesión');
            return false;
        }
    }

    function login() {

        $user = json_decode(file_get_contents("php://input"));

        $userDB = self::$dataBase->selectOne('SELECT * FROM User WHERE email = ?', [$user->email]);
        if (!$userDB) {
            $this->addError(404, 'No existe el usuario');
            return false;
        }
        if (empty($userDB['activo'])) {
            $this->addError(404, 'El usuario no está activo');
            return false;
        }
        if (!password_verify($user->passwd, $userDB['passwd'])) {
            $this->addError(404, 'La constraseña no es correcta');
            return false;
        }

        unset($userDB['passwd']);
        $userDB = (object) $userDB;
        $tipos = self::$dataBase->select("SELECT type FROM usertype WHERE userId = ?", [$userDB->userId]);
        $userDB->tipo = array_column($tipos, 'type');

        $GLOBALS['SESSION']['user'] = $userDB;

        return ['user' => $userDB, 'token' => $GLOBALS['SESSION']['token']];
    }

}
