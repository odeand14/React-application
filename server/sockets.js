const ws = require('ws');

exports.connect = httpServer => {
    const wsServer = new ws.Server({server: httpServer});


    const clients = [];

    wsServer.on('connection', socket => {
        clients.push(socket);

        socket.on('message', message => {
            wsServer.clients.forEach(client => {
                if (client !== socket) {
                    client.send(message)
                }
            });
        });
    });

};