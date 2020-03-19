const Socket = {
    io: null,
    init: function(server) {
        this.io = require('socket.io').listen(server);
        return this.io;
    },
    getIo: function() {
        if (!this.io) 
            throw new Error("IO not initialzed");
        return this.io
    }
}

module.exports = Socket;