(function() {
	var app = angular.module('attribute-directives', []);

	// Header Directive
	app.directive('trafficSpecs', function() {
		return {
			restrict: 'A',
			templateUrl: 'templates/specs.html'
		}
	});

})();