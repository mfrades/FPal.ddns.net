<?php
/*
 * Clase que representa el núcleo d de la aplicación, accediendo a la
 * configuración almacenada en conf/core.json y lanzando a ejecución las clases
 * que se encargan de la lógica de negocio
 */
Class Core {

    public $ajax = false;
    public $config = [];

    public function __construct() {
        $this->autoloader();
        $this->xdebugSetup();
        $this->checkAjax();
        $this->config = (array) json_decode(file_get_contents('conf/core.json'));
        if (!empty($this->config['production'])) {
            register_shutdown_function([$this, 'shutdown']);
            error_reporting(0);
        } else {
            error_reporting(E_ALL);
        }
        date_default_timezone_set('Europe/Madrid');
    }

    private function autoloader() {
        spl_autoload_register(function($class) {
            $ruta = 'controllers/' . $class . '.php';
            if (file_exists($ruta)) {
                include_once $ruta;
            }
            $ruta = 'framework/' . $class . '.php';
            if (file_exists($ruta)) {
                include_once $ruta;
            }
        });
    }

    private function xdebugSetup() {
        ini_set('display_error', '1');
        ini_set('xdebug.var_display_max_depth', 5);
        ini_set('xdebug.var_display_max_children', 256);
        ini_set('xdebug.var_display_max_data', 1024);
    }

    private function checkAjax() {
        $HTTP_X_REQUESTED_WITH = filter_input(INPUT_SERVER, 'HTTP_X_REQUESTED_WITH');
        if (strtolower($HTTP_X_REQUESTED_WITH) == 'xmlhttprequest') {
            $this->ajax = true;
        }
    }

    public function error($code) {
        $message = 'Ha ocurrido un error inesperado';
        switch ($code) {
            case 404:
                $message = 'No se encuentra la pagina';
                break;
        }

        $this->cleanBuffer();

        header_remove();
        header('HTTP/1.0 ' . $code . ' ' . $message);
        exit;
    }

    public function launch($className, $method, $param) {
        if (!is_file('controllers/' . $className . '.php')) {
            $this->error(404);
        }

        if (!class_exists($className)) {
            $this->error(404);
        }

        $class = new $className();

        $return = call_user_func_array([$class, $method], $param);

        if ($return === false) {
            if (!$class->checkErrors()) {
                $this->error(404);
            }
        } else {
            header('HTTP/1.0 200');
            header('Content-Type: application/json');
            exit(json_encode($return));
        }
    }

    public function shutdown() {
        $error = error_get_last();
        if ($error['type'] === E_ERROR) {
            $this->error(500);
        }
    }

    public function cleanBuffer() {
        while (ob_get_level()) {
            ob_end_clean();
        }
    }

}
