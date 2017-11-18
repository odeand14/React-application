const ws = require('ws');

exports.connect = httpServer => {
    const wsServer = new ws.Server({server: httpServer});


    const clients = [];

    wsServer.on('connection', socket => {
        clients.push(socket);

        socket.on('close', function() {
            clients.splice(clients.indexOf(socket), 1);
            console.log('Client disconnected.');
        });
        socket.on('error', function() {
            clients.splice(clients.indexOf(socket), 1);
            console.log('ERROR');
        });
        socket.on('disconnect', () => console.log('Client disconnected'));

        socket.on('message', message => {
            wsServer.clients.forEach(client => {
                if (client !== socket) {
                    client.send(message)
                }
            });
        });
    });

};