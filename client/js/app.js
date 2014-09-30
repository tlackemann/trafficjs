/**
 * Script file for handling basic UX
 *
 * @package		Traffic
 * @version		1.0.0
 * @author		Thomas Lackemann <tommylackemann@gmail.com>
 * @copyright	Copyright (c) 2014, Thomas Lackemann
 */

define([
	'marionette',
	'templates',
	'views/Login'
], function (Marionette, Login) {
	'use strict';
	var App = new Marionette.Application();

	var NotFoundView = Backbone.View.extend({

	});

	// Add regions to our app
	App.addRegions({
		container: '#traffic'
	});

	App.on("notFound", function() {
		App.main.show(new NotFoundView());
	})

	return App;
});