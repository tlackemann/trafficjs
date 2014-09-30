/**
 * Server entry-point - Creates necessary api routes
 *
 * @package		Traffic
 * @version		1.0.0
 * @author		Thomas Lackemann <tommylackemann@gmail.com>
 * @copyright	Copyright (c) 2014, Thomas Lackemann
 */

(function() {
	"use strict";

	var express = require('express'),
		config = require('./../config'),
    	logger = require('morgan'),
    	path = require('path'),
		session = require('express-session'),
		RedisStore = require('connect-redis')(session),
		Traffic = require('./traffic'),
		app = express(),
		port = process.env.PORT || config.server.port || 9001,
		server,
		io,
		traffic;

	// Announce the boot the application
	console.log("Preparing server for Traffic.js Game");

	// Enable logging if development mode
	if (app.get('env') === 'development') {
		app.use(logger("dev"));
	}

	// Configure and start the redis session (for persistent sessions)
	// I'm actually wondering why this would even be necessary now
	// app.use(session({
	// 	saveUninitialized: true,
	// 	resave: true,
	// 	store: new RedisStore({
	// 		host: (config.redis.host) ? config.redis.host : 'localhost',
	// 		port: (config.redis.port) ? config.redis.port : 6379,
	// 		db: 1,
	// 		pass: (config.redis.pass) ? config.redis.pass : ''
	// 	}),
	// 	secret: (config.redis.secret) ? config.redis.secret : ''
	// }));

	// Setup the initial route
	app.get('/', function(req, res) {
		res.sendFile(path.resolve('client/index.html'));
	});

	// Start the server and socketio
	server = require('http').createServer(app).listen(port, function() {
		console.log("Server is listening on port " + port);
	});
	io = require('socket.io').listen(server);

	// Start the game logic
	traffic = new Traffic(app, io);
	traffic.init();

	/**
	 * Serves the content of the client folder as public files
	 * The application will be responsible for serving pending and active games
	 * and letting the end-user join as an opponent or a spectator
	 */
	app.use(express.static(__dirname + '/../client'));

	console.log("Finished bootstrapping Traffic.js - enjoy ;)");
})();