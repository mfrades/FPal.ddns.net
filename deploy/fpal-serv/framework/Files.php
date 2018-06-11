<?php
/*
 * Clase que sirve para manejar los ficheros y eliminarlos si es preciso
 * Eliminando el directorio que los contiene
 */
Class Files {

    static public function deleteDir($dir, $deleteDir = true) {
        $dir = trim($dir, '/');
        if (!is_dir($dir)) {
            return false;
        }
        $files = scandir($dir);
        $ficherosEliminados = 0;
        foreach ($files as $f) {
            if ($f === '.' || $f === '..') {
                continue;
            }
            if (is_file($dir . '/' . $f)) {
                unlink($dir . '/' . $f);
            } elseif (is_dir($dir . '/' . $f)) {
                self::deleteDir($dir . '/' . $f);
            }
        }
        if ($deleteDir) {
            rmdir($dir);
        }
    }

}
