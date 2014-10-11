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
		id: "traffic-canvas",
		bitsize: 48,
		gridsize: 7,
		framerate: 32,
		defaultSpeed: 200
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
		var options = options || {},

		/**
		 * Reference to self
		 * @var {Entity}
		 */
		self = this,

		/**
		 * Entity loaded 
		 * @protected
		 * @var {Boolean}
		 */
		ready = false,

		/**
		 * Image source
		 * @protected
		 * @param {String}
		 */
		imageSrc = options.imageSrc || '',

		/**
		 * Entity image (if any)
		 * @protected
		 * @var {String|Boolean}
		 */
		image = new Image(),

		/**
		 * The method to run when render() is called
		 * @protected
		 * @var {Function}
		 */
		renderMethod = function() {},

		/**
		 * If we're processing then the Entity is moving
		 * @protected
		 * @var {Boolean}
		 */
		processing = false,

		/**
		 * Entity selected
		 * @protected
		 * @var {Boolean}
		 */
		selected = false,

		/**
		 * The size, in blocks, of the Entity (x, y)
		 * @protected
		 * @var {Object}
		 */
		blocks = function() {
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
		this.scheduledX = false,

		/**
		 * Scheduled Y position
		 * @var {Number}
		 */
		this.scheduledY = false,

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

		/**
		 * Checks if this Entity is colliding with another Entity
		 * Should prevent the Entity from moving further
		 * @param {Entity} checkEntity
		 * @return void
		 */
		this.checkCollision = function(checkEntity) {

		},

		/**
		 * Determines if the Entity needs to be moved and adjusts accordingly
		 * Accounts for the size of the grid so it snaps to the farthest edge
		 * @param {Number} modifier
		 * @return void
		 */
		this.move = function(modifier) {
			var x = this.x,
				y = this.y,
				scheduledX = this.scheduledX,
				scheduledY = this.scheduledY;

			// @todo - This is bad because if we ever create a 1x1 Entity, they will only be able to move
			// x|y but not both, might be useful for moving "powerups" around the map so the players can
			// reach them by moving other pieces
			if (selected && processing && (scheduledX !== false || scheduledY !== false)) {
				// Move forward  X
				if (this.movement === 'x') {
					if (scheduledX > x + this.size('x')) {
						this.x += this.speed * modifier;
					}
					// Move backward X
					else if (scheduledX - Config.bitsize < x) {
						this.x -= this.speed * modifier;
					}
					// done moving
					else {
						this.scheduledX = false;
						processing = false;
					}

				} else if (this.movement === 'y') {
					// Move forward Y
					if (scheduledY > y + this.size('y')) {
						this.y += this.speed * modifier;
					}
					// Move backward Y
					else if (scheduledY - Config.bitsize < y) {
						this.y -= this.speed * modifier;
					}
					// done moving
					else {
						this.scheduledY = false;
						processing = false;
					}
				}
			}
		},

		/**
		 * Adds an event to the canvas
		 * @param {String} eventName
		 * @param {Function} eventMethod
		 * @return {Entity}
		 */
		this.addEvent = function(eventName, eventMethod) {
			var canvas = self.canvas || document.getElementById(Config.id);
			canvas.addEventListener(eventName, eventMethod, false);
			return this;
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
				return parseInt(blocks[xy]);
			} else {
				return blocks;
			}
		},

		/**
		 * Selects the Entity
		 * @return {Entity}
		 */
		this.select = function () {
			// console.log("Selecting " + this.name);
			selected = true;

			// Let the Entity know that we've just selected it to prevent movement
			// on the initial click (something about when the event is fired and
			// timing of the the update() method)
			processing = false;

			return this;
		},

		/**
		 * Unselects the Entity
		 * @return {Entity}
		 */
		this.unselect = function() {
			//console.log("Unselecting " + this.name);
			selected = false;
			return this;
		},

		/**
		 * Checks if the Entity is selected
		 * @param {String} entityName
		 * @return {Boolean}
		 */
		this.isSelected = function(entityName) {
			return selected;
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
			// If the Entity is selected, schedule the movement
			if (selected && !processing) {
				// Snap the x,y coordinates to the size of the grid
				if (this.movement.toLowerCase() === 'x') {
					this.scheduledX = Math.ceil(x/Config.bitsize) * Config.bitsize;
				} else if (this.movement.toLowerCase() === 'y') {
					this.scheduledY = Math.ceil(y/Config.bitsize) * Config.bitsize;
					// console.log("Scheduled to move to " + this.scheduledY);
				}
				// Now that we've told the Entity to move to a new location
				// set processing to true so we know to move it
				processing = true;
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
			self.canvas.id = Config.id;
			document.getElementById('traffic-canvas-container').appendChild(self.canvas);
		},

		/**
		 * Checks for entity collision during update()
		 * @protected
		 * @param {Number} modifier
		 * @return void
		 */
		_checkCollision = function(modifier) {

		},

		/**
		 * Checks for new entity positions and moves them on update()
		 * @protected
		 * @param {Number} modifier
		 * @return void
		 */
		_checkEntities = function(modifier) {
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
					if (selectedEntity.name === entity.name) {
						entity.move(modifier);
					}
				}
			}
		},

		getOffsetX = function(x) {
			var screenWidth = window.innerWidth,
				centerPoint = screenWidth/2,
				gameWidth = document.getElementById(Config.id).width,
				offsetX = centerPoint - (gameWidth/2);

			return x - offsetX;
		},

		getOffsetY = function(y) {
			return y;
		},

		/**
		 * Add the entities
		 * @return void
		 * @todo - Load from some sort of map layout
		 */
		_addEntities = function() {
		 	// Background entity
			self.addEntity('background', {
				blocks: {x: Config.gridsize, y: Config.gridsize},
				speed: 0
			});
			// Main player
			self.addEntity('player-1', {
				imageSrc: 'images/monster.png',
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
			self.addEntity('car-1', {
				blocks: {x: 1, y: 2},
				x: 3 * Config.bitsize,
				y: 0,
				movement: 'y'
			});

			// Sedan 1
		},

		/**
		 * Configure the entities listeners and draw methods
		 * @return void
		 * @todo - Load from some sort of map layout
		 */
		_configureEntities = function() {
		 	var background = self.entity('background'),
		 		player = self.entity('player-1'),
		 		player2 = self.entity('player-2'),
		 		truck1 = self.entity('truck-1'),
		 		car1 = self.entity('car-1');

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
				.addEvent('traffic.change.turn', function(event) {
					if (player.turn) {
						self.setTurn(player2);
					} else if (player2.turn) {
						self.setTurn(player);
					}
				})
				.addEvent('click', function(event) {
					var clickX = getOffsetX(event.x),
						clickY = getOffsetY(event.y),
						entityClicked,
						entityMinX,
						entityMinY,
						entityMaxX,
						entityMaxY,
						entity,
						e;

					// Loop through all the entities and decide what to do
					for(e in entities) {
						if (entities.hasOwnProperty(e)) {
							entity = entities[e];
							// Don't try to move the background
							if (entity.name !== 'background') {
								// Get the entity coordinates vs where was clicked
								entityMinX = entity.x,
								entityMinY = entity.y,
								entityMaxX = entity.size('x') + entity.x,
								entityMaxY = entity.size('y') + entity.y,
								entityClicked = (entity.canSelect(currentTurnEntity.name)
													&& clickX >= entityMinX
													&& clickX <= entityMaxX
													&& clickY >= entityMinY
													&& clickY <= entityMaxY);

								if (entityClicked) {
									self.selectEntity(entity);
								} else {
									selectedEntity.scheduleMovement(clickX, clickY);
								}
							}
						}
					}
				});

			// Set the players images draw method
			player
				.onRender(function() {
					if (player.isReady()) {
						self.ctx.beginPath();
						self.ctx.rect(player.x, player.y, player.size('x'), player.size('y'));
						self.ctx.fillStyle = (player.isSelected()) ? 'yellow' : 'red';
						self.ctx.fill();
						// self.ctx.drawImage(player.getImage(), player.x, player.y);
					}
				});

			// Set the player2 images draw method
			player2
				.onRender(function() {
					if (player2.isReady()) {
						self.ctx.beginPath();
						self.ctx.rect(player2.x, player2.y, player2.size('x'), player2.size('y'));
						self.ctx.fillStyle = (player2.isSelected()) ? 'yellow' : 'blue';
						self.ctx.fill();
					}
				});

			// Set the truck images draw method
			truck1
				.onRender(function() {
					if (truck1.isReady()) {
						self.ctx.beginPath();
						self.ctx.rect(truck1.x, truck1.y, truck1.size('x'), truck1.size('y'));
						self.ctx.fillStyle = (truck1.isSelected()) ? 'yellow' : 'white';
						self.ctx.fill();
					}
				});

			// Set the truck images draw method
			car1
				.onRender(function() {
					if (car1.isReady()) {
						self.ctx.beginPath();
						self.ctx.rect(car1.x, car1.y, car1.size('x'), car1.size('y'));
						self.ctx.fillStyle = (car1.isSelected()) ? 'yellow' : 'purple';
						self.ctx.fill();
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
					entities[e].unselect();
				}
			}

			// Set the selected entity
			entity.select();

			// Make the new selected entity available to the game
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

			console.log("Changing turns " + entity.name);
			// Select the entity who's turn it is
			this.selectEntity(entity);

			// Let all entities know who's allowed to move them
			for(e in entities) {
				if (entities.hasOwnProperty(e)) {
					entities[e].allow = entity.name;
					entities[e].turn = false;
				}
			}

			// Make sure that players cant access each other
			if (entity.name === 'player-1') {
				entities['player-2'].allow = false;
			} else if (entity.name === 'player-2') {
				entities['player-1'].allow = false;
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
			this.entity('car-1').render();

			// Score
			this.ctx.fillStyle = "rgb(0,0,0)";
			this.ctx.font = "12px Helvetica";
			this.ctx.textAlign = "left";
			this.ctx.textBaseline = "top";
			//this.ctx.fillText("FPS: " + this.getFPS(), 32, 32);
			this.ctx.fillText("Selected: " + selectedEntity.name, Config.bitsize / 4, Config.bitsize / 4);
			this.ctx.fillText("Turn: " + currentTurnEntity.name, Config.bitsize / 4, Config.bitsize / 2);
			this.ctx.fillText("FPS: " + this.getFPS(), Config.bitsize / 4, Config.bitsize - (Config.bitsize / 4));
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