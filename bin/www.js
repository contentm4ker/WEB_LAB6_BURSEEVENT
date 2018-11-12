const app = require('../express');

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const debug = require('debug')('web_lab6-burseevent:server');


let port = 80;
server.listen(port, ()=>{
    console.log(`HTTP server started at http://localhost:${port}`);
});
server.on('error', onError);
server.on('listening', onListening);

io.sockets.on('connection', (socket) => {
    socket.on('hello', (msg) => {
        let time = (new Date()).toLocaleTimeString();
        socket['name'] = msg.name;
        send(socket, `${msg.name} присоединился`, `${time}`)
    });
    socket.on('subscribeToTimer', (interval) => {
        console.log('client is subscribing to timer with interval ', interval);
        setInterval(() => {
            socket.emit('timer', new Date());
        }, interval);
    });
    socket.on('disconnect', (msg) => {
        if (socket['name']) {
            let time = (new Date()).toLocaleTimeString();
            send(socket, `${socket['name']} вышел`, `${time}`);
        }
    });
});

function send(socket, msg, time) {
    socket.json.emit('msg', {'message': msg, 'time': time});
    socket.broadcast.emit('msg', {'message': msg, 'time': time});
}


function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

module.exports = server;