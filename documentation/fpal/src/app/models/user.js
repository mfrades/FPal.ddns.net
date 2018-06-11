"use strict";
var User = (function () {
    function User() {
        this.userId = null;
        this.email = '';
        this.passwd = '';
        this.tipo = [];
        this.nombre = '';
        this.apellido = '';
        this.foto = '';
        this.formacion = '';
        this.intereses = '';
        this.perspectivas = '';
        this.activo = false;
    }
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.js.map