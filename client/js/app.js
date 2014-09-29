
define([
	'marionette',
	'views/Login'
], function (Marionette, Login) {
	'use strict';
	var app = new Marionette.Application();

	return window.app = app;
});