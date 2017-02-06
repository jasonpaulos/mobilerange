var app = angular.module('mobilerange', []);

app.controller('MainController', ['$scope', 'socket',
	function ($scope, socket) {
		$scope.shots = [];
		$scope.shotsHistory = [];
		$scope.avgShot = null;
		$scope.mode = 'Practice';
		$scope.shotsRemaining = -1;
		$scope.sightingPeriod = false;
		
		$scope.startMatch = function () {
			$scope.mode = 'Match';
			$scope.sightingPeriod = true;
			$scope.shots = [];
			$scope.avgShot = null;
			$scope.shotsHistory = [];
		};
		
		$scope.endSighting = function () {
			$scope.sightingPeriod = false;
			$scope.shotsRemaining = 60;
			$scope.shots = [];
			$scope.avgShot = null;
		};
		
		$scope.clearShots = function () {
			$scope.shots = [];
			$scope.avgShot = null;
		};
		
		$scope.shotRadius = 2.6;
		$scope.gridSide = 76.245;
		$scope.groupSize = 15;
		$scope.rightAdjustment = 0;
		$scope.downAdjustment = 0;
		
		$scope.grid = [];
		
		var gridSpaceBetweenHoles = 6;
		var gridOffset = $scope.gridSide/2 - gridSpaceBetweenHoles * 5;
		for (var y = 0; y < 11; y++) {
			var xMin = 0;
			var xMax = 11;
			
			if (y === 0 || y === 10) {
				xMin = 2;
				xMax = 9;
			} else if (y === 1 || y === 9) {
				xMin = 1;
				xMax = 10;
			}
			
			for (var x = xMin; x < xMax; x++) {
				$scope.grid.push({
					x: gridOffset + x * gridSpaceBetweenHoles,
					y: gridOffset + y * gridSpaceBetweenHoles
				});
			}
		}
		
		$scope.updateAvg = function () {
			if ($scope.shots.length >= 2) {
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
			} else {
				$scope.avgShot = null;
			}
		}
		
		socket.on('shot', function (shots) {
			for (var i = 0; i < shots.length; i++) {
				var hole = $scope.grid[shots[i]];
				
				$scope.shots.push({
					x: hole.x,
					y: hole.y
				});
				
				if ($scope.mode === 'Match' && !$scope.sightingPeriod) {
					if ($scope.shots.length >= $scope.groupSize) {
						$scope.shotsHistory = $scope.shotsHistory.concat($scope.shots);
						$scope.shots = [];
					}
					
					$scope.shotsRemaining--;
					
					if ($scope.shotsRemaining < 0) {
						endMatch();
					}
				}
			}
			
			$scope.updateAvg();
		});
		
		function endMatch() {
			$scope.mode = 'Practice';
			$scope.shotsRemaining = -1;
			$scope.shots = [];
			$scope.avgShot = null;
		}
	}
]);
