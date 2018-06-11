<?php
/*
 * en esta clase se lleva a cabo el análisis de las URIs de las peticiones 
 * recibidas de forma que se determina la clase y el método que hay que ejecutar 
 * así como los parámetros que deben pasársele para la ejecución 
 * (en caso de que sean necesarios).  
 * Lee el fichero conf/routing.json que es donde se establecen las 
 * correspondencias entre rutas, métodos y clases a ejecutar.
 */
Class Routing {

    public $protocol = '';
    public $protocolURL = '';
    public $host = '';
    public $uri = '';
    public $segments = [];
    public $routes = [];

    public function __construct() {
        $this->protocol = filter_input(INPUT_SERVER, 'SERVER_PROTOCOL');
        $this->protocolURL = filter_input(INPUT_SERVER, 'SERVER_PROTOCOL');
        $this->host = filter_input(INPUT_SERVER, 'HTTP_HOST');
        $this->uri = explode('?', trim(filter_input(INPUT_SERVER, 'REQUEST_URI'), '/'))[0];
        $this->segments = explode('/', $this->uri);
        $this->routes = json_decode(file_get_contents("conf/routing.json"));
    }

    public function getRoute() {
        $method = $_SERVER['REQUEST_METHOD'];

        $uri = '/' . $this->uri;
        $inverseSegments = array_reverse($this->segments);
        $param = [];
        foreach ($inverseSegments as $segment) {
            if (property_exists($this->routes, $uri) && property_exists($this->routes->$uri, $method)) {
                $classMethod = explode('/', $this->routes->$uri->$method);
                return ['class' => $classMethod[0], 'method' => $classMethod[1], 'params' => $param];
            }
            $pos = strpos($uri, '/' . $segment);
            if ($pos !== false) {
                $uri = substr($uri, 0, $pos);
                array_unshift($param, $segment);
            } else {
                return false;
            }
        }
        if (property_exists($this->routes, $uri) && property_exists($this->routes->$uri, $method)) {
            $classMethod = explode('/', $this->routes->$uri->$method);
            return ['class' => $classMethod[0], 'method' => $classMethod[1], 'params' => $param];
        }
        return false;
    }

    public function ruta($class, $method) {
        return $this->host . '/' . array_search($class . '/' . $method, $this->routes);
    }

    public function baseURL() {
        return 'http://' . $this->host . '/';
    }

}
