<?php

Class pruebas Extends Controller {

    public function __construct() {
        parent::__construct();
    }

    function pruebas() {
        dbObject::createClasses();
        exit();
    }

    function test() {
        exit('fpal-serv is running');
    }

}
