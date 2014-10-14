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
	
	app.controller('GameController', ['$http', '$location', function($http, $location) {
		var Traffic = this;
		// @todo - change to fetch from server
		this.games = [];

		$http.get('/games').success(function(data) {
			Traffic.games = data;
		});

		this.startGame = function() {
			console.log('start a game');
		},

		this.openSplash = function () {
		    $splash.open({
		      title: 'Hi there!',
		      message: "This sure is a fine modal, isn't it?"
		    });
		},

		this.changeUrl = function(url) {
			return $location.url([url]);
		}

	}]);

	// var games = [
	// 	{
	// 		player1: 'Player1',
	// 		player2: 'Player2',
	// 		createdAt: Date.now(),
	// 		totalMoves: 32,
	// 		spectators: [
	// 			'Anon1',
	// 			'Anon2'
	// 		]
	// 	},
	// 	{
	// 		player1: 'Player3',
	// 		player2: 'Player4',
	// 		createdAt: Date.now(),
	// 		totalMoves: 5,
	// 		spectators: [
	// 			'Anon1',
	// 			'Anon3',
	// 			'Anon4'
	// 		]
	// 	},
	// 	{
	// 		player1: 'Player5',
	// 		player2: 'Player6',
	// 		createdAt: Date.now(),
	// 		totalMoves: 2,
	// 		spectators: [
	// 		]
	// 	},
	// 	{
	// 		player1: 'Player7',
	// 		player2: 'Player8',
	// 		createdAt: Date.now(),
	// 		totalMoves: 14,
	// 		spectators: [
	// 			'Anon1'
	// 		]
	// 	},
	// 	{
	// 		player1: 'Player9',
	// 		player2: 'Player10',
	// 		createdAt: Date.now(),
	// 		totalMoves: 9,
	// 		spectators: [
	// 			'Anon1',
	// 			'Anon2'
	// 		]
	// 	},
	// 	{
	// 		player1: 'Player11',
	// 		player2: 'Player12',
	// 		createdAt: Date.now(),
	// 		totalMoves: 12,
	// 		spectators: [
	// 			'Anon1',
	// 			'Anon2',
	// 			'Anon3',
	// 			'Anon4'
	// 		]
	// 	}
	// ];
})();