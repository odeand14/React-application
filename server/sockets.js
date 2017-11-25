const ws = require('ws');

exports.connect = httpServer => {
    const wsServer = new ws.Server({server: httpServer});


    function heartbeat() {
        this.isAlive = true;
    }

    const clients = [];

    wsServer.on('connection', socket => {
        console.log('Client connected.');
        clients.push(socket);
        socket.on('pong', heartbeat);

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

    const interval = setInterval(function ping() {
        wsServer.clients.forEach(ws => {
            if (ws.isAlive === false) return ws.terminate();

            ws.isAlive = false;
            ws.ping('', false, true);
        });
    }, 30000);

};