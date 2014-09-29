define([
	'backbone',
	'models/Game',
	'localStorage'
], function (Backbone, Game) {
	'use strict';

	return Backbone.Collection.extend({
		model: Game,

		localStorage: new Backbone.LocalStorage('games-backbone'),

		getCompleted: function () {
			return this.where({completed: true});
		},

		getActive: function () {
			return this.where({completed: false});
		},

		comparator: 'created'
	});
});