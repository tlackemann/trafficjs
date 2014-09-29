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
		//localStorage: '../bower_components/backbone.localStorage/backbone.localStorage',
		socket: '/socket.io/socket.io'
	},
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			exports: 'Backbone',
			deps: ['jquery', 'underscore']
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
	'socket'
], function (app, Backbone, socket) {
	'use strict';

	app.start();

	Backbone.history.start();
});