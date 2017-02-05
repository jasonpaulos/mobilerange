var app = angular.module('mobilerange', []);

app.controller('MainController', ['$scope', 'socket',
	function ($scope, socket) {
		$scope.shots = [];
		$scope.avgShot = null;
		
		$scope.shotRadius = 2.6;
		$scope.gridSide = 76.245;
		
		$scope.grid = [];
		
		var gridSpaceBetweenHoles = 6;
		var gridOffset = $scope.gridSide/2 - gridSpaceBetweenHoles * 5;
		for (var x = 0; x < 11; x++) {
			var yMin = 0;
			var yMax = 11;
			
			if (x === 0 || x === 10) {
				yMin = 2;
				yMax = 9;
			} else if (x === 1 || x === 9) {
				yMin = 1;
				yMax = 10;
			}
			
			for (var y = yMin; y < yMax; y++) {
				$scope.grid.push({
					x: gridOffset + x * gridSpaceBetweenHoles,
					y: gridOffset + y * gridSpaceBetweenHoles
				});
			}
		}
		
		socket.on('shot', function (shot) {
			var hole = $scope.grid[shot.index];
			
			$scope.shots.push({
				x: hole.x,
				y: hole.y
			});
			
			if ($scope.shots.length >= 2) {
				if ($scope.shots.length > 15) {
					$scope.shots.shift();
				}
				
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
		});
	}
]);
