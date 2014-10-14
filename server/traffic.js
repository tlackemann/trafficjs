/**
 * Server entry-point - Creates necessary api routes
 *
 * @package		Traffic
 * @version		1.0.0
 * @author		Thomas Lackemann <tommylackemann@gmail.com>
 * @copyright	Copyright (c) 2014, Thomas Lackemann
 */

var database = require('./database'),
	Traffic;

module.exports = function() {
	"use strict";

	Traffic = function(app, io) {

		// Start the routes
		var _initRoutes = function() {
			// Fetch a list of games
			app.get('/games', function(req, res) {
				var games = [
		{
			player1: 'Player1',
			player2: 'Player2',
			createdAt: Date.now(),
			totalMoves: 32,
			spectators: [
				'Anon1',
				'Anon2'
			]
		},
		{
			player1: 'Player3',
			player2: 'Player4',
			createdAt: Date.now(),
			totalMoves: 5,
			spectators: [
				'Anon1',
				'Anon3',
				'Anon4'
			]
		},
		{
			player1: 'Player5',
			player2: 'Player6',
			createdAt: Date.now(),
			totalMoves: 2,
			spectators: [
			]
		},
		{
			player1: 'Player7',
			player2: 'Player8',
			createdAt: Date.now(),
			totalMoves: 14,
			spectators: [
				'Anon1'
			]
		},
		{
			player1: 'Player9',
			player2: 'Player10',
			createdAt: Date.now(),
			totalMoves: 9,
			spectators: [
				'Anon1',
				'Anon2'
			]
		},
		{
			player1: 'Player11',
			player2: 'Player12',
			createdAt: Date.now(),
			totalMoves: 12,
			spectators: [
				'Anon1',
				'Anon2',
				'Anon3',
				'Anon4'
			]
		}
	];
				res.send(games);
			});

			// Start a new game
			app.post('/start', function(req, res) {
				
			});
		}
		this.init = function() {
			io.on('connection', function(socket){
			  console.log('a user connected');
			});

			_initRoutes();
		};

		return this;
	};

	return Traffic;
}();