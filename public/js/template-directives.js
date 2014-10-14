(function() {
	var app = angular.module('template-directives', []);

	// Handles the current user session
	var SessionController = function() {
		this.active = false;

	};

	// Header Directive
	app.directive('trafficSidebar', function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/sidebar.html'
		}
	});

	// Footer Directive
	app.directive('trafficFooter', function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/footer.html'
		}
	});

	// Login Directive
	app.directive('trafficStartGame', function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/login.html',
			controller: SessionController,
			controllerAs: 'session'
		}
	});

	// List Directive
	app.directive('trafficList', function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/games.html',
			controller: SessionController,
			controllerAs: 'session'
		}
	});

	// Game Directive
	app.directive('trafficGame', function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/traffic.html',
			controller: SessionController,
			controllerAs: 'session'
		}
	});

})();