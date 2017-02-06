'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var serial = require('./serial.js');

var app = express();
var server = http.createServer(app);

serial(server);

app.use(express.static(path.join(__dirname, '../client/dist')));

server.listen(8080, 'localhost', function () {
	console.log('Server listening on 8080');
});
