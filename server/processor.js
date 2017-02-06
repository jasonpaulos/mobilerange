'use strict';

var dataMap = require('./dataMap.json');
var dataKeys = Object.keys(dataMap);

function Processor(io) {
	this.io = io;
}

Processor.prototype.processData = function processData(data) {
	var possible = [];
	
	for (var i = 0; i < dataKeys.length; i++) {
		var key = dataKeys[i];
		var section = dataMap[key];
		var measured = data[key];
		
		if (measured < section.threshold) {
			continue;
		}
		
		var closest = {
			distance: Infinity,
			index: -1
		};
		for (var j = 0; j < section.values.length; j++) {
			var value = section.values[j];
			var distance = Math.abs(measured - value.avg);
			
			if (distance < closest.distance) {
				closest.distance = distance;
				closest.index = value.index;
			}
		}
		
		if (closest.index !== -1) {
			possible.push(closest.index);
			
			console.log(key + ' ' + measured + ' matched ' + closest.index);
		}
	}
	
	return possible;
}

module.exports = Processor;
