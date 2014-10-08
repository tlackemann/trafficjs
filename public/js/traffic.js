/**
 * Script file for handling basic UX
 *
 * @package		Traffic
 * @version		1.0.0
 * @author		Thomas Lackemann <tommylackemann@gmail.com>
 * @copyright	Copyright (c) 2014, Thomas Lackemann
 */

(function() {
	var app = angular.module('traffic', ['template-directives', 'attribute-directives']);
	var games = [
		{
			player1: 'Player1',
			player2: 'Player2',
			spectators: [
				'Anon1',
				'Anon2'
			]
		},
		{
			player1: 'Player3',
			player2: 'Player4',
			spectators: [
				'Anon1',
				'Anon3',
				'Anon4'
			]
		},
		{
			player1: 'Player5',
			player2: 'Player6',
			spectators: [
			]
		},
		{
			player1: 'Player7',
			player2: 'Player8',
			spectators: [
				'Anon1'
			]
		},
		{
			player1: 'Player9',
			player2: 'Player10',
			spectators: [
				'Anon1',
				'Anon2'
			]
		},
		{
			player1: 'Player11',
			player2: 'Player12',
			spectators: [
				'Anon1',
				'Anon2',
				'Anon3',
				'Anon4'
			]
		}
	];

	app.controller('GameController', ['$http', '$location', function($http, $location) {
		// @todo - change to fetch from server
		this.games = games;


	}]);
})();