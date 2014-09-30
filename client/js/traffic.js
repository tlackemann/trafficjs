/**
 * Script file for handling basic UX
 *
 * @package		Traffic
 * @version		1.0.0
 * @author		Thomas Lackemann <tommylackemann@gmail.com>
 * @copyright	Copyright (c) 2014, Thomas Lackemann
 */

require.config({
	paths: {
		underscore: '../bower_components/underscore/underscore',
		backbone: '../bower_components/backbone/backbone',
		marionette: '../bower_components/backbone.marionette/lib/backbone.marionette.min',
		jquery: '../bower_components/jquery/dist/jquery.min',
		localStorage: '../bower_components/backbone.localStorage/backbone.localStorage',
		handlebars: '../bower_components/handlebars/handlebars.min',
		socketio: '../socket.io/socket.io'
	},
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			exports: 'Backbone',
			deps: ['jquery', 'underscore']
		},
		socketio: {
			exports: 'io'
		},
		marionette: {
			exports: 'Backbone.Marionette',
			deps: ['backbone']
		}
	},
	deps: ['jquery', 'underscore']
});

require([
	'app',
	'backbone',
	'routers/index',
	'controllers/index',
	'socketio'
], function (app, Backbone, Router, Controller, io) {
	'use strict';
	app.start();
	var socket = io.connect('http://localhost:1234');

	new Router({ controller: Controller });

	Backbone.history.start();
});