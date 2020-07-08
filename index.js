const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use(express.static(__dirname + '/'));
app.get('/', function(req, res) {
    res.render('index.ejs');
});

io.sockets.on('connection', function(socket) {
    var room = io.sockets.adapter.rooms['game room'];
    
    if (!room || room.length < 3){
    socket.join('game room');
    oom = io.sockets.adapter.rooms['game room'];
    socket.on('username', function(username) {
        socket.username = username;
        console.log("connection!");
        io.emit('is_online', '🔵 <i>' + socket.username + ' joined the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });
    if (room && room.length == 2){
        socket.on('player1 move', function(message) {
            io.emit('player1 moves', message);
        });
        socket.on('player2 move', function(message) {
            io.emit('player2 moves', message);
        });
    }
} else {
    console.log("too many people in chat!")
}
});

const server = http.listen(8080, function() {
    console.log('listening on *:8080');
});