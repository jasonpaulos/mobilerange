var app = angular.module('mobilerange');

app.service('socket', ['$rootScope',
	function ($rootScope) {
		var socket = io.connect();
		
		function on(event, callback) {
			socket.on(event, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		}
		
		function emit(event, data, callback) {
			socket.emit(event, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
		
		return {
			on: on,
			emit: emit
		};
	}
]);
