<?php
/*
 * La clase Controller representa el contexto de la ejecución
 * Almacena en sus atributos estáticos el acceso al núcleo del backend, al 
 * servicio de enrutado, a la base de datos y a los errores
 */
Class Controller {

    public static $core;
    public static $routing;
    public static $dataBase;
    public static $errors = [];

    public function __construct() {

    }

    public static function setCore(\Core $core) {
        if (!self::$core) {
            self::$core = $core;
        }
    }

    public static function setDataBase(\DataBase $dataBase) {
        if (!self::$dataBase) {
            self::$dataBase = $dataBase;
        }
    }

    public static function setRouting(\Routing $routing) {
        if (!self::$routing) {
            self::$routing = $routing;
        }
    }

    public function response($body = '', $code = 200) {
        header("HTTP/1.0 " . $code);
        exit($body);
    }

    public function addError($code, $mess) {
        if (is_string($mess)) {
            self::$errors[] = ['code' => $code, 'mess' => $mess];
        } elseif (is_array($mess)) {
            foreach ($mess as $m) {
                $this->addError($code, $m);
            }
        }
    }

    public function checkErrors() {
        $errors = self::$errors;
        if (empty($errors)) {
            return false;
        }
        $last = $errors[count($errors) - 1];
        header("HTTP/1.0 " . $last['code']);
        header("Content-Type: text");
        exit(json_encode(array_column($errors, 'mess')));
    }

}
