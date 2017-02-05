'use strict';

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

io.on('connection', function (client) {
	console.log('client connected');
	
	client.on('some message', function (msg) {
		console.log(JSON.stringify(msg));
	});
});

setInterval(function () {
	io.emit('shot', {
		x: Math.random() * 100,
		y: Math.random() * 100
	});
}, 1000);

app.use(express.static(path.join(__dirname, '../client/dist')));

server.listen(8080, 'localhost', function () {
	console.log('Server listening on 8080');
});
