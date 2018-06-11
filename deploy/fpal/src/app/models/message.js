"use strict";
var Message = (function () {
    function Message() {
        this.messageId = null;
        this.senderId = null;
        this.receiverId = null;
        this.sender = '';
        this.receiver = '';
        this.subject = '';
        this.body = '';
        this.fechaAdd = '';
        this.show = false;
        this.leido = false;
    }
    return Message;
}());
exports.Message = Message;
//# sourceMappingURL=message.js.map