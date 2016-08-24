var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var root = __dirname + '/drawingboard';
var drawings = new Array();
var id; // socket id
var sseLocation = process.env.SSE_LOCATION || 'localhost:8080';

app.use(express.static(root));

io.on('connection', function (socket) {

    var drawingId = socket.handshake['query']['drawingId'];
    socket.join(drawingId);
    console.log('user joined to ' + drawingId);
    var drawing = drawings[drawingId];
    if (drawing)
        for (i = 0; i < drawing.length; i++)
            socket.emit('shape', drawing[i]);
    else
        drawings[drawingId] = [];
    socket.emit('sseLocation' , {'sseLocation' : sseLocation});
    socket.on('disconnect', function () {
        socket.leave(drawingId);
        console.log('user disconnected from ' + drawingId);
    });

    socket.on('shape', function (msg) {
        drawings[drawingId].push(msg);
        io.to(drawingId).emit('shape', msg);
    });

});

var PORT = process.env.PORT || 8888;
console.log('server started at port ' + PORT);
server.listen(PORT);
