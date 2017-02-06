'use strict';

var socketio = require('socket.io');
var SerialPort = require('serialport');
var Processor = require('./processor.js');

module.exports = function register(server) {
	var io = socketio(server);
	var processor = new Processor(io);
	
	io.on('connection', function (client) {
		console.log('Client connected');
	});
	
	var port = new SerialPort('COM3', {
		parser: SerialPort.parsers.readline('\n')
	}, function (err) {
		if (err) throw err;
		
		port.on('data', function (str) {
			if (!str.startsWith('{')) {
				return;
			}
			
			var data = JSON.parse(str);
			var msg = processor.processData(data);
			
			if (msg.length > 0) {
				io.emit('shot', msg);
			}
		});
		
		port.on('close', function () {
			throw new Error('Serial connection closed');
		});
		
		console.log('Serial connection open');
	});
};
