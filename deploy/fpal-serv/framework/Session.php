<?php
/*
 * se encarga del manejo de las sesiones, analizando a partir de un token que 
 * identifica al fichero de sesión si una sesión es válida o está caducada.
 */
Class Session {

    private $token;
    private $sessionsRoute;
    private $object;
    private $caducidadMin = 60;

    public function __construct() {
        $this->sessionsRoute = $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'sessions';
        $tokenGet = filter_input(INPUT_GET, 'token');

        if (is_file($this->sessionsRoute . DIRECTORY_SEPARATOR . $tokenGet . '.json')) {
            $this->token = $tokenGet;
            $this->object = (array) json_decode(file_get_contents($this->sessionsRoute . DIRECTORY_SEPARATOR . $this->token . '.json'));
            if ($this->caducada()) {
                $this->token = $this->token(10) . uniqid();
                $this->object = [];
            }
        } else {
            $this->token = $this->token(10) . uniqid();
            $this->object = [];
        }

        $this->object['timeStart'] = date('Y-m-d H:i:s');
        $this->object['token'] = $this->token;
        $GLOBALS['SESSION'] = $this->object;
        $GLOBALS['_session'] = $this;
        $this->saveSession();
    }

    public function save() {
        file_put_contents($this->sessionsRoute . '/' . $this->token . '.json', json_encode($GLOBALS['SESSION']));
    }

    public function caducada() {
        if (empty($this->object['timeStart'])) {
            return true;
        }
        $start = new DateTime($this->object['timeStart']);
        $now = new DateTime();

        $minutes = ($now->getTimestamp() - $start->getTimestamp()) / 60;

        if ($minutes > $this->caducidadMin) {
            return true;
        } else {
            return false;
        }
    }

    public function token($length) {
        $token = "";
        $codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $codeAlphabet .= "abcdefghijklmnopqrstuvwxyz";
        $codeAlphabet .= "0123456789";
        $max = strlen($codeAlphabet);

        for ($i = 0; $i < $length; $i++) {
            $token .= $codeAlphabet[mt_rand(0, $max - 1)];
        }

        return $token;
    }

    private function saveSession() {
        register_shutdown_function(function() {
            if (!empty($GLOBALS['_session'])) {
                $GLOBALS['_session']->save();
            }
        });
    }

}
