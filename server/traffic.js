/**
 * Server entry-point - Creates necessary api routes
 *
 * @package		Traffic
 * @version		1.0.0
 * @author		Thomas Lackemann <tommylackemann@gmail.com>
 * @copyright	Copyright (c) 2014, Thomas Lackemann
 */

var Traffic;

module.exports = function() {
	"use strict";

	Traffic = function(app, io) {

		this.init = function() {
			io.on('connection', function(socket){
				console.log(socket.id + ' connected');
			  
				socket.on('disconnect', function() {
					console.log(socket.id + ' disconnected');
				});
			});
		};

		return this;
	};

	return Traffic;
}();