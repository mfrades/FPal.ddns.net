<?php

$accesAllowed = [
    'http://localhost:3000',
    'http://fpal.es',
    'http://fpal-serv.es',
	'http://fpal.ddns.net',
	'http://fpal-serv.ddns.net'];
$host = filter_input(INPUT_SERVER, 'HTTP_ORIGIN');

if (in_array($host, $accesAllowed)) {
    header('Access-Control-Allow-Origin: ' . $host);
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTION');
    header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
	
}

header('Content-type: text/html; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    die;
}

include_once 'framework/Core.php';
$core = new Core();

$routing = new Routing();
new Session();

$router = $routing->getRoute();

if (!$router) {
    $core->error(404);
}

$dataBase = new DataBase();

Controller::setCore($core);
Controller::setRouting($routing);
Controller::setDataBase($dataBase);
dbObject::setDataBase($dataBase);


$core->launch($router['class'], $router['method'], $router['params']);
