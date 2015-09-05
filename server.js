var http = require('http');
var fs = require('fs');

//var server = http.createServer(function(req, res) {
//    fs.readFile('./index.html', 'utf-8', function(error, content) {
//        res.writeHead(200, {"Content-Type": "text/html"});
//        res.end(content);
//    });
//});

// Express
var express = require('express');
var app = express();
var server = require('http').Server(app);
app.use('/bower_components', express.static('bower_components'));
app.use('/client', express.static('client'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Socket.io
var io = require('socket.io')(server);

// Users list
var users = require('./users');
var games = require('./games');

io.sockets.on('connection', function (socket) {
    var address = socket.request.connection.remoteAddress + ':' + socket.request.connection.remotePort;

    var user = new users.User(address);
    users.users.add(user, socket);

    // Init new user
    socket.emit('init', {
        user: user,
        users: users.users.getAll()
    });
    socket.emit('server:info', 'You are connected');

    // Warn all about the new user
    socket.broadcast.emit('user:join', {
        user: user
    });

    socket.on('send:message', function (message) {
        io.sockets.emit('send:message', user.name + ': ' + message);
    });

    socket.on('disconnect', function () {
        socket.broadcast.emit('user:left', {
            name: user.name
        });
        users.users.remove(user);
    });

    // validate a user's name change, and broadcast it on success
    socket.on('change:name', function (data, callback) {
        var oldName = user.name;
        if (users.userNames.claim(data.name, user)) {

            user.name = data.name;
            socket.broadcast.emit('change:name', {
                oldName: oldName,
                newName: user.name
            });

            callback(true);
        } else {
            callback(false);
        }
    });

    var gameUpdateCallback = function(game) {
        socket.emit('game:update', game);
        var p2Socket = users.users.getSocket(game.player2);
        if (p2Socket) {
            p2Socket.emit('game:update', game);
        }
    };

    socket.on('user:challenge', function(user2) {
        console.log('user ' + user.name + ' is challenging ' + user2.name);
        var game = new games.Game(gameUpdateCallback, user, user2);
        games.games.push(game);
        games.userToGame[user.name] = game;
        games.userToGame[user2.name] = game;
        game.start();

        socket.emit('game:start', game);
        var p2Socket = users.users.getSocket(user2);
        if (p2Socket) {
            p2Socket.emit('game:start', game);
        }
    });

    socket.on('user:input', function(keysDown) {
        var game = games.userToGame[user.name];
        if (game) {
            game.updateKeysDown(keysDown, user);
        }
    });
});



server.listen(8081);