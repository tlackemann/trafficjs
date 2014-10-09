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
		bitsize: 64,
		gridsize: 7,
		framerate: 32,
		defaultSpeed: 500
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
		 * Reference to self
		 * @var {Entity}
		 */
		var self = this;

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
		 * Name of the entity 
		 * @var {String}
		 */
		this.name = options.name || '',

		/**
		 * X position
		 * @var {Number}
		 */
		this.x = options.x || 0,

		/**
		 * Y position
		 * @var {Number}
		 */
		this.y = options.y || 0,

		/**
		 * Scheduled X position
		 * @var {Number}
		 */
		this.scheduledX = this.x,

		/**
		 * Scheduled Y position
		 * @var {Number}
		 */
		this.scheduledY = this.y,

		/**
		 * Entity selected
		 * @var {Boolean}
		 */
		this.selected = false,

		/**
		 * Entity turn
		 * @var {Boolean}
		 */
		this.turn = false,

		/**
		 * Who is allowed to select the Entity
		 * @var {Boolean|String}
		 */
		this.allow = false,

		/**
		 * Speed
		 * @var {Number}
		 */
		this.speed = options.speed || Config.defaultSpeed,

		/**
		 * Lock movement on the X|Y axis
		 * @var {String}
		 */
		this.movement = options.movement || 'x',

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

		this.checkCollision = function(checkEntity) {
			// if (this.x <= (checkEntity.x + checkEntity.size('x'))
			// 	&& checkEntity.x <= (this.x + this.size('x'))
			// 	&& this.y <= (checkEntity.y + checkEntity.size('y'))
			// 	&& checkEntity.y <= (this.y + this.size('y')))
			// {
			// 	console.log(this.name + " is colliding with " + checkEntity.name);
			// }
		},

		/**
		 * Determines if the Entity needs to be moved and adjusts accordingly
		 * Accounts for the size of the grid so it snaps to the farthest edge
		 * @param {Number} modifier
		 */
		this.move = function(modifier) {

			var x = Math.floor(this.x),
				y = Math.floor(this.y),
				scheduledX = Math.floor(this.scheduledX),
				scheduledY = Math.floor(this.scheduledY);

			if (this.selected) {
				// Move along the X axis 
				if (x + this.size('x') === scheduledX) {
					this.x = scheduledX - this.size('x');
					this.scheduledX = scheduledX - this.size('x');
				} else if (x - this.size('x') === scheduledX) {
					this.x = scheduledX + this.size('x');
					this.scheduledX = scheduledX + this.size('x');
				} else if (x < scheduledX) {
					this.x += this.speed * modifier;
				} else if (x > scheduledX) {
					this.x -= this.speed * modifier;
				}

				// Move along the Y axis
				if (x + this.size('y') === scheduledY) {
					this.y = scheduledY - this.size('y');
					this.scheduledY = scheduledY - this.size('y');
				} else if (y - this.size('y') === scheduledY) {
					this.y = scheduledY + this.size('y');
					this.scheduledY = scheduledY + this.size('y');
				} else if (y < scheduledY) {
					this.y += this.speed * modifier;
				} else if (y > scheduledY) {
					this.y -= this.speed * modifier;
				}
			}
		},

		/**
		 * Adds an event to the Entity (well window, for now)
		 * @param {String} eventName
		 * @param {Function} eventMethod
		 * @return {Entity}
		 */
		this.addEvent = function(eventName, eventMethod) {
			addEventListener(eventName, eventMethod, false);
		},

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
		},

		/**
		 * Checks if we're allowed to select this Entity
		 * @param {String} entityName
		 * @return {Boolean}
		 */
		this.canSelect = function(entityName) {
			return this.allow === entityName;
		},

		/**
		 * Calculates and sets the new position
		 * @param {Number} x
		 * @param {Number} y
		 * @return {Entity}
		 */
		this.scheduleMovement = function(x, y) {
			// Snap the x,y coordinates to the size of the grid
			if (this.movement.toLowerCase() === 'x') {
				this.scheduledX = Math.ceil(x/Config.bitsize) * Config.bitsize;
			} else {
				this.scheduledY = Math.ceil(y/Config.bitsize) * Config.bitsize;
			}

			return this;
		},

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
		 * @var {Entity}
		 */
		var selectedEntity = null;

		/**
		 * Current Entity's turn
		 * @protected
		 * @var {Entity}
		 */
		var currentTurnEntity = null;

		/**
		 * Canvas element
		 * @var {Object}
		 */
		this.canvas = null,

		/**
		 * CTX object
		 * @var {Object}
		 */
		this.ctx = null;

		var _addCanvas = function() {
			self.canvas = document.createElement("canvas");
			self.ctx = self.canvas.getContext('2d');
			self.canvas.width = Config.bitsize * Config.gridsize;
			self.canvas.height = Config.bitsize * Config.gridsize;
			document.body.appendChild(self.canvas);
		};

		/**
		 * Checks for entity collision during update()
		 * @protected
		 * @param {Number} modifier
		 * @return void
		 */
		var _checkCollision = function(modifier) {
			// Are they touching?
			// if (
			// 	self.entity('player-1').x <= (self.entity('player-2').x + 32)
			// 	&& self.entity('player-2').x <= (self.entity('player-1').x + 32)
			// 	&& self.entity('player-1').y <= (self.entity('player-2').y + 32)
			// 	&& self.entity('player-2').y <= (self.entity('player-1').y + 32)
			// ) {
			// 	self.reset();
			// }
		};

		/**
		 * Checks for new entity positions and moves them on update()
		 * @protected
		 * @param {Number} modifier
		 * @return void
		 */
		var _checkEntities = function(modifier) {
			var e, c,
				entity,
				checkEntity;

			// Check if any of our Entities have new coordinates to move to and move them
			for(e in entities) {
				if (entities.hasOwnProperty(e) && entities[e].name !== 'background') {
					entity = entities[e];
					// Check the collisions between all entities
					for (c in entities) {
						if (entities.hasOwnProperty(e)) {
							checkEntity = entities[c];
							if (checkEntity.name !== entity.name && checkEntity.name !== 'background') {
								entity.checkCollision(checkEntity);
							}
						}
					}
					entity.move(modifier);
				}
			}
		};

		/**
		 * Add the entities
		 * @return void
		 * @todo - Load from some sort of map layout
		 */
		var _addEntities = function() {
		 	// Background entity
			self.addEntity('background', {
				blocks: {x: Config.gridsize, y: Config.gridsize},
				speed: 0
			});
			// Main player
			self.addEntity('player-1', {
				blocks: {x: 2, y: 1}
			});
			// Opponent
			self.addEntity('player-2', {
				blocks: {x: 2, y: 1}
			});
			// Truck 1
			self.addEntity('truck-1', {
				blocks: {x: 1, y: 3},
				x: 2 * Config.bitsize,
				y: 0,
				movement: 'y'
			});

			// Car 1

			// Sedan 1
		 };

		/**
		 * Configure the entities listeners and draw methods
		 * @return void
		 * @todo - Load from some sort of map layout
		 */
		var _configureEntities = function() {
		 	var background = self.entity('background'),
		 		player = self.entity('player-1'),
		 		player2 = self.entity('player-2'),
		 		truck1 = self.entity('truck-1');

			// Set the background images draw method
			background
				.onRender(function() {
					if (background.isReady()) {
						self.ctx.beginPath();
						self.ctx.rect(background.x, background.y, background.size('x'), background.size('y'));
						self.ctx.fillStyle = 'grey';
						self.ctx.fill();
					}
				})
				.addEvent('click', function(event) {
					// Move the selected Entity to the farthest path along the movement axis
					selectedEntity.scheduleMovement(event.x, event.y);
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
					if (player.canSelect(currentTurnEntity.name) && event.x >= minX && event.x <= maxX && event.y >= minY && event.y <= maxY) {
						self.selectEntity(player);
					}
				});

			// Set the player2 images draw method
			player2
				.onRender(function() {
					if (player2.isReady()) {
						self.ctx.beginPath();
						self.ctx.rect(player2.x, player2.y, player2.size('x'), player2.size('y'));
						self.ctx.fillStyle = (player2.selected) ? 'yellow' : 'blue';
						self.ctx.fill();
					}
				})
				.addEvent('click', function(event) {
					var minX = player2.x,
						minY = player2.y,
						maxX = player2.size('x') + player2.x,
						maxY = player2.size('y') + player2.y;

					// Check if we clicked this piece
					if (player2.canSelect(currentTurnEntity.name) && event.x >= minX && event.x <= maxX && event.y >= minY && event.y <= maxY) {
						self.selectEntity(player2);
					}
				});

			// Set the truck images draw method
			truck1
				.onRender(function() {
					if (truck1.isReady()) {
						self.ctx.beginPath();
						self.ctx.rect(truck1.x, truck1.y, truck1.size('x'), truck1.size('y'));
						self.ctx.fillStyle = (truck1.selected) ? 'yellow' : 'white';
						self.ctx.fill();
					}
				})
				.addEvent('click', function(event) {
					var minX = truck1.x,
						minY = truck1.y,
						maxX = truck1.size('x') + truck1.x,
						maxY = truck1.size('y') + truck1.y;

					// Check if we clicked this piece
					if (truck1.canSelect(currentTurnEntity.name) && event.x >= minX && event.x <= maxX && event.y >= minY && event.y <= maxY) {
						self.selectEntity(truck1);
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
			// Add the name attribute
			options = options || {};
			options.name = name;
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
		 * Set the current Entity's turn
		 * @param {Entity} entity
		 * @return {Traffic}
		 */
		this.setTurn = function(entity) {
			var e;

			// Select the entity who's turn it is
			this.selectEntity(entity);

			// Let all entities know who's allowed to move them
			for(e in entities) {
				if (entities.hasOwnProperty(e)) {
					if (!(entity.name === 'player-1' && entities[e].name === 'player-2')) {
						entities[e].allow = entity.name;
					}
				}
			}

			// Set the selected entity
			entity.turn = true;
			currentTurnEntity = entity;

			return this;
		},

		/**
		 * Load the entities and starts the game loop
		 * @return void
		 */
		this.start = function() {
			// Add the canvas to the page
			_addCanvas();

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
			this.reset();
			this.main();
		},

		/**
		 * Reset the game state
		 * @return void
		 * @todo - Load from some sort of map layout
		 */
		this.reset = function() {
			var player = this.entity('player-1'),
				player2 = this.entity('player-2');

			// Set the first player to the selected entity
			this.setTurn(player);

			// Render the player2 and player
			player.x = 0;
			player.y = Config.bitsize * 1;
			// To prevent default movement
			player.scheduledX = 0;
			player.scheduledY = Config.bitsize * 1;

			player2.x = (Config.bitsize * Config.gridsize) - player2.size('x');
			player2.y = (Config.bitsize * Config.gridsize) - player2.size('y') - Config.bitsize;
		},

		/**
		 * Updates the game logic
		 * @param {Number} modifier
		 * @return void
		 */
		this.update = function(modifier) {
			_checkCollision(modifier);
			_checkEntities(modifier);
		},

		/**
		 * Renders the current game states
		 * @return void
		 * @todo - Load from some sort of map layout
		 */
		this.render = function() {
			this.entity('background').render();
			this.entity('player-1').render();
			this.entity('player-2').render();
			this.entity('truck-1').render();

			// Score
			this.ctx.fillStyle = "rgb(0,0,0)";
			this.ctx.font = "12px Helvetica";
			this.ctx.textAlign = "left";
			this.ctx.textBaseline = "top";
			//this.ctx.fillText("FPS: " + this.getFPS(), 32, 32);
			this.ctx.fillText("Turn: " + currentTurnEntity.name, Config.bitsize / 4, Config.bitsize - 12);
			this.ctx.fillText("Selected: " + selectedEntity.name, Config.bitsize / 4, Config.bitsize / 4);
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