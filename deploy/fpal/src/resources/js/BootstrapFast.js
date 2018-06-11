//USE JQUERY
"use strict";
var bf = {

    modalQuestion: function (title, message, onAccept, onReject) {
        var modal = $(`<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="gridSystemModalLabel">${title}</h4>
            </div>
            <div class="modal-body">
                ${message}
            </div>
            <div class="modal-footer" style="text-align:center">
                <button type="button" class="btn btn-primary acceptModal" data-dismiss="modal">ACEPTAR</button>
                <button type="button" class="btn btn-danger" data-dismiss="modal">RECHAZAR</button>
            </div>
        </div>
    </div>
</div>`);

        var Accepted = false;
        $(modal).find('button.acceptModal').on('click', function () {
            if (typeof onAccept === 'function') {
                onAccept();
            }
            Accepted = true;
        });
        $(modal).on('hidden.bs.modal', function () {
            if (!Accepted && typeof onReject === 'function') {
                onReject();
            }
            $(modal).remove();
        });
        $('body').append(modal);
        modal.modal('show');
    },
    modalInfo: function (title, message, onClose) {
        var modal = $(`<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="gridSystemModalLabel">${title}</h4>
            </div>
            <div class="modal-body">
                ${message}
            </div>
            <div class="modal-footer" style="text-align:center">
                <button type="button" class="btn btn-default" data-dismiss="modal">CERRAR</button>
            </div>
        </div>
    </div>
</div>`);


        $(modal).on('hidden.bs.modal', function () {
            if (typeof onClose === 'function') {
                onClose();
            }
            $(modal).remove();
        });
        $('body').append(modal);
        modal.modal('show');
    },

    randomText: function (length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                + "abcdefghijklmnopqrstuvwxyz"
                + "0123456789";

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    },

};


