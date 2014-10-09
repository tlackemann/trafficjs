/**
 * Traffic Game
 *
 * @package		Traffic
 * @version		1.0.0
 * @author		Thomas Lackemann <tommylackemann@gmail.com>
 * @copyright	Copyright (c) 2014, Thomas Lackemann
 */

(function() {
	"use strict";

	var TrafficGame = null;
	
	var Config = {
		bitsize: 48,
		framerate: 32
	};

	/**
	 * Entity object
	 * 
	 * @param {Object} options
	 * @return {Entity}
	 */
	var Entity = function(options) {
		/**
		 * Default set of options
		 * @var {Object}
		 */
		var options = options || {};

		/**
		 * Entity loaded 
		 * @protected
		 * @var {Boolean}
		 */
		var ready = false;

		/**
		 * Image source
		 * @protected
		 * @param {String}
		 */
		var imageSrc = options.imageSrc || '';

		/**
		 * Entity image (if any)
		 * @protected
		 * @var {String|Boolean}
		 */
		var image = new Image();

		/**
		 * The method to run when render() is called
		 * @protected
		 * @var {Function}
		 */
		var renderMethod = function() {};

		/**
		 * The size, in blocks, of the Entity (x, y)
		 * @protected
		 * @var {Object}
		 */
		var blocks = function() {
			var bitX = Config.bitsize,
				bitY = Config.bitsize,
				option = options.blocks;

			if (option && option.x) {
				bitX = option.x * Config.bitsize;
			}
			if (option && option.y) {
				bitY = option.y * Config.bitsize;
			}

			return {
				x: bitX,
				y: bitY
			}
		}();

		/**
		 * X position
		 * @var {Number}
		 */
		this.x = 0,

		/**
		 * Y position
		 * @var {Number}
		 */
		this.y = 0,

		/**
		 * Entity selected
		 * @var {Boolean}
		 */
		this.selected = false,

		/**
		 * Speed
		 * @var {Number}
		 */
		this.speed = options.speed || 0,

		/**
		 * Set the render method
		 * @param {Function} method
		 * @return {Entity}
		 */
		this.onRender = function(method) {
			renderMethod = method;
			return this;
		},

		/**
		 * Render the Entity based on the renderMethod
		 * @return void
		 */
		this.render = function() {
			renderMethod();
		},

		/**
		 * Adds an event to the Entity (well window, for now)
		 * @param {String} eventName
		 * @param {Function} eventMethod
		 * @return {Entity}
		 */
		this.addEvent = function(eventName, eventMethod) {
			addEventListener(eventName, eventMethod, false);
		}

		/**
		 * Checks if the Entity is ready
		 * @return {Boolean}
		 */
		this.isReady = function() {
			return ready;
		},

		/**
		 * Gets the Entity Image object
		 * @return {Object}
		 */
		this.getImage = function() {
			return image;
		},

		/** 
		 * Return the Entity size (in x or y)
		 * @return {Number|Object}
		 */
		this.size = function(xy) {
			if (xy) {
				return blocks[xy];
			} else {
				return blocks;
			}
		}

		/**
		 * Perform preload activity
		 * @return {Entity}
		 */
		this.start = function() {
			// Set the image src if there is one
			if (imageSrc) {
				image.src = imageSrc;

				// When the image is ready, we're ready
				image.onload = function() {
					ready = true;
				}
			} else {
				ready = true;
			}

			return this;
		};

		return this;
	};

	/**
	 * Traffic game object
	 * 
	 * @return {Entity}
	 */
	var Traffic = function() {
		/**
		 * Reference to this
		 * @protected
		 * @var {Object}
		 */
		var self = this;

		/**
		 * List of available entities
		 * @protected
		 * @var {Object}
		 */
		var entities = {};

		/**
		 * Past loop time
		 * @protected
		 * @var {Date}
		 */
		var then = Date.now();

		/**
		 * Current loop time
		 * @protected
		 * @var {Date}
		 */
		var now = Date.now();

		/**
		 * Delta loop time
		 * @protected
		 * @var {Date}
		 */
		var delta = now - then;

		/**
		 * Active pressed keys
		 * @protected
		 * @var {Object}
		 */
		var keysDown = {};

		/**
		 * Current framenumber
		 * @protected
		 * @var {Number}
		 */
		var frameNumber = 0;


		/**
		 * Start time for frame rate
		 * @protected
		 * @var {Number}
		 */
		var startTime = 0;

		/**
		 * Current selected Entity
		 * @protected
		 * @var {Entity|Boolean}
		 */
		var selectedEntity = false;

		/**
		 * Canvas element
		 * @var {Object}
		 */
		this.canvas = document.getElementById("traffic-canvas"),

		/**
		 * CTX object
		 * @var {Object}
		 */
		this.ctx = this.canvas.getContext('2d');

		/**
		 * Check if keys are pressed during update()
		 * @protected
		 * @param {Number} modifier
		 * @return void
		 */
		var _checkKeys = function(modifier) {
			if (38 in keysDown) { // Player holding up
				self.entity('player').y -= self.entity('player').speed * modifier;
			}
			if (40 in keysDown) { // Player holding down
				self.entity('player').y += self.entity('player').speed * modifier;
			}
			if (37 in keysDown) { // Player holding left
				self.entity('player').x -= self.entity('player').speed * modifier;
			}
			if (39 in keysDown) { // Player holding right
				self.entity('player').x += self.entity('player').speed * modifier;
			}
		};


		/**
		 * Checks for entity collision during update()
		 * @protected
		 * @param {Number} modifier
		 * @return void
		 */
		var _checkCollision = function(modifier) {
			// Are they touching?
			if (
				self.entity('player').x <= (self.entity('opponent').x + 32)
				&& self.entity('opponent').x <= (self.entity('player').x + 32)
				&& self.entity('player').y <= (self.entity('opponent').y + 32)
				&& self.entity('opponent').y <= (self.entity('player').y + 32)
			) {
				//++opponentsCaught;
				self.reset();
			}
		};

		 var _addEntities = function() {
		 	// Background entity
			self.addEntity('background', {
				blocks: {x: 12, y: 12}
			});
			// Main player
			self.addEntity('player', {
				blocks: {x: 2, y: 1},
				speed: 200
			});
			// Opponent
			self.addEntity('opponent', {
				blocks: {x: 2, y: 1},
				speed: 200
			});
		 };

		 var _configureEntities = function() {
		 	var background = self.entity('background'),
		 		player = self.entity('player'),
		 		opponent = self.entity('opponent');

			// Set the background images draw method
			background
				.onRender(function() {
					if (background.isReady()) {
						self.ctx.beginPath();
						self.ctx.rect(background.x, background.y, background.size('x'), background.size('y'));
						self.ctx.fillStyle = 'grey';
						self.ctx.fill();
					}
				});

			// Set the players images draw method
			player
				.onRender(function() {
					if (player.isReady()) {
						self.ctx.beginPath();
						self.ctx.rect(player.x, player.y, player.size('x'), player.size('y'));
						self.ctx.fillStyle = (player.selected) ? 'yellow' : 'red';
						self.ctx.fill();
					}
				})
				.addEvent('click', function(event) {
					var minX = player.x,
						minY = player.y,
						maxX = player.size('x') + player.x,
						maxY = player.size('y') + player.y;

					// Check if we clicked this piece
					if (event.x >= minX && event.x <= maxX && event.y >= minY && event.y <= maxY) {
						self.selectEntity(player);
					}
				});

			// Set the opponent images draw method
			opponent
				.onRender(function() {
					if (opponent.isReady()) {
						self.ctx.beginPath();
						self.ctx.rect(opponent.x, opponent.y, opponent.size('x'), opponent.size('y'));
						self.ctx.fillStyle = (opponent.selected) ? 'yellow' : 'blue';
						self.ctx.fill();
					}
				})
				.addEvent('click', function(event) {
					var minX = opponent.x,
						minY = opponent.y,
						maxX = opponent.size('x') + opponent.x,
						maxY = opponent.size('y') + opponent.y;

					// Check if we clicked this piece
					if (event.x >= minX && event.x <= maxX && event.y >= minY && event.y <= maxY) {
						self.selectEntity(opponent);
					}
				});
		};

		/**
		 * Adds and starts a new Entity
		 * @param {String} name
		 * @param {Object} options
		 * @return {Entity}
		 */
		this.addEntity = function(name, options) {
			entities[name] = new Entity(options);
			entities[name].start();
			return entities[name];
		},

		/**
		 * Get an available Entity object
		 * @param {String} name
		 * @return {Entity}
		 * @throws {Exception}
		 */
		this.entity = function(name) {
			if (entities[name]) {
				return entities[name];
			} else {
				throw new Exception("Could not find Entity '" + name + "'");
			}
		},

		/**
		 * Select an entity
		 * @param {Entity} entity
		 * @return {Traffic}
		 */
		this.selectEntity = function(entity) {
			var e;

			// Set all other entities as unselected
			for(e in entities) {
				if (entities.hasOwnProperty(e)) {
					entities[e].selected = false;
				}
			}

			// Set the selected entity
			entity.selected = true;
			selectedEntity = entity;

			return this;
		},

		/**
		 * Load the entities and starts the game loop
		 * @return void
		 */
		this.start = function() {
			// Setup the entities
			_addEntities();
			_configureEntities();

			// Add event listeners
			addEventListener("keydown", function (e) {
				keysDown[e.keyCode] = true;
			}, false);
			addEventListener("keyup", function (e) {
				delete keysDown[e.keyCode];
			}, false);

			// Run it!
			this.main();
		},

		/**
		 * Reset the game state
		 * @return void
		 */
		this.reset = function() {
			var player = this.entity('player'),
				opponent = this.entity('opponent');

			// Set the first player to the selected entity
			this.selectEntity(player);

			// Render the opponent and player
			player.x = 0;
			player.y = 0;
			opponent.x = 200;
			opponent.y = 200;
		},

		/**
		 * Updates the game logic
		 * @param {Number} modifier
		 * @return void
		 */
		this.update = function(modifier) {
			_checkKeys(modifier);
			_checkCollision(modifier);
		},

		/**
		 * Renders the current game states
		 * @return void
		 */
		this.render = function() {
			this.entity('background').render();
			this.entity('player').render();
			this.entity('opponent').render();

			// Score
			this.ctx.fillStyle = "rgb(250, 250, 250)";
			this.ctx.font = "24px Helvetica";
			this.ctx.textAlign = "left";
			this.ctx.textBaseline = "top";
			this.ctx.fillText("FPS: " + this.getFPS(), 32, 32);
		},

		/**
		 * Calculate the current framerate
		 * @return {Number}
		 */
		this.getFPS = function(){
			frameNumber++;
			var d = now,
				currentTime = ( d - startTime ) / 1000,
				result = Math.floor((frameNumber / currentTime));

			if( currentTime > 1 ){
				startTime = new Date().getTime();
				frameNumber = 0;
			}
			return result;
		},

		/**
		 * The main game loop
		 * @return void
		 */
		this.main = function() {
			now = Date.now();
			delta = now - then;
			self.update(delta / 1000);
			self.render();
			then = now;

			// Request to do this again ASAP
			requestAnimationFrame(self.main);
		};

		return this;
	};

	TrafficGame = new Traffic();
	TrafficGame.start();
})();