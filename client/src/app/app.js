var app = angular.module('mobilerange', []);

app.controller('MainController', ['$scope', 'socket',
	function ($scope, socket) {
		$scope.shots = [];
		$scope.avgShot = null;
		
		socket.on('shot', function (shot) {
			if ($scope.shots.length > 1) {
				$scope.avgShot = {
					x: 0,
					y: 0
				};
				
				$scope.shots.forEach(function (shot) {
					$scope.avgShot.x += shot.x;
					$scope.avgShot.y += shot.y;
				});
				
				$scope.avgShot.x /= $scope.shots.length;
				$scope.avgShot.y /= $scope.shots.length;
			}
			
			$scope.shots.push({
				x: shot.x,
				y: shot.y
			});
		});
	}
]);
