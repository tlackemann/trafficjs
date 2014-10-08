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
				res.send([]);
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