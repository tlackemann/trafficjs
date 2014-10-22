/**
 * Traffic Game
 *
 * @package		Traffic
 * @version		1.0.0
 * @author		Thomas Lackemann <tommylackemann@gmail.com>
 * @copyright	Copyright (c) 2014, Thomas Lackemann
 */

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
	var self = this,

	/**
	 * List of available entities
	 * @protected
	 * @var {Object}
	 */
	entities = {},

	/**
	 * Past loop time
	 * @protected
	 * @var {Date}
	 */
	last = Date.now(),

	/**
	 * Current loop time
	 * @protected
	 * @var {Date}
	 */
	now = Date.now(),

	/**
	 * Delta loop time
	 * @protected
	 * @var {Date}
	 */
	delta = now - last,

	/**
	 * Step count
	 * @protected
	 * @var {Number}
	 */
	step = 1/60,

	/**
	 * Active pressed keys
	 * @protected
	 * @var {Object}
	 */
	keysDown = {},

	/**
	 * Current framenumber
	 * @protected
	 * @var {Number}
	 */
	frameNumber = 0,

	/**
	 * Start time for frame rate
	 * @protected
	 * @var {Number}
	 */
	startTime = 0,

	/**
	 * Current selected Entity
	 * @protected
	 * @var {Entity}
	 */
	selectedEntity = null,

	/**
	 * Current Entity's turn
	 * @protected
	 * @var {Entity}
	 */
	currentTurnEntity = null,

	/**
	 * Current level information
	 * @protected 
	 * @var {Object}
	 */
	level = false;

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

	/**
	 * Setup the canvas and append to the DOM
	 * @return void
	 */
	var _addCanvas = function() {
		self.canvas = document.createElement("canvas");
		self.ctx = self.canvas.getContext('2d');
		self.canvas.width = Config.bitsize * Config.gridsize;
		self.canvas.height = Config.bitsize * Config.gridsize;
		self.canvas.id = Config.id;
		document.getElementById(Config.container).appendChild(self.canvas);
	},

	/**
	 * Checks for new entity positions and moves them on update()
	 * @protected
	 * @param {Number} modifier
	 * @return void
	 */
	_checkEntities = function(modifier) {
		var entity,
			e;

		if (selectedEntity) {
			// Check all entity collisions
			for (e in entities) {
				if (entities.hasOwnProperty(e) && entities.name !== 'background') {
					selectedEntity.checkCollision(entities[e]);
				}
			}
			selectedEntity.move(modifier);
		}
	},

	/**
	 * Calibrates the X position of a click relative to the game area
	 * @protected
	 * @param {Number} x
	 * @return {Number}
	 */
	getOffsetX = function(x) {
		var offsetX = $('#' + Config.id).offset().left; // jQuery required
		return x - offsetX;
	},

	/**
	 * Calibrates the Y position of a click relative to the game area
	 * @protected
	 * @param {Number} y
	 * @return {Number}
	 */
	getOffsetY = function(y) {
		var offsetY = $('#' + Config.id).offset().top; // jQuery required
		return y - offsetY;
	},

	/**
	 * Loads a level from the Config array (for now)
	 * @protected
	 * @return void
	 */
	_loadLevel = function() {
		if (!level) {
			if (!Config.levels.length) {
				throw "No levels specified in the Configuration file";
			}
			// Load a random level
			level = Config.levels[Math.floor((Math.random() * Config.levels.length))];
		}
	},

	/**
	 * Add the entities
	 * @return void
	 */
	_addEntities = function() {
		var entity,
			e;

	 	// Background entity
		self.addEntity('background', {
			blocks: {x: Config.gridsize, y: Config.gridsize},
			speed: 0,
			color: level.background
		});
		// add the exits
		for (e in level.exits) {
			if (level.exits.hasOwnProperty(e)) {
				entity = level.exits[e];
				self.addEntity('exit-' + e, {
					imageSrc: entity.imageSrc,
					blocks: {x: 1, y: 1},
					x: entity.x,
					y: entity.y,
					movement: entity.movement,
					color: 'black'
				})
			}
		}

		// add the objects
		for (e in level.objects) {
			if (level.objects.hasOwnProperty(e)) {
				entity = level.objects[e];
				self.addEntity(e, {
					imageSrc: entity.imageSrc,
					blocks: entity.blocks,
					x: entity.x,
					y: entity.y,
					movement: entity.movement,
					color: entity.color
				})
			}
		}
	},

	/** 
	 * Renders each individual block on the screen
	 * Responsible for highlighting selected pieces
	 * @protected
	 * @param {Object} block
	 * @return void
	 */
	_onRenderBlock = function(block) {
		return function() {
			if (block.isReady()) {
				// The block itself
				self.ctx.beginPath();
				self.ctx.rect(block.x, block.y, block.size('x'), block.size('y'));
				self.ctx.fillStyle = block.color;
				self.ctx.fill();
				// Render the glow and inner stroke
				if (block.isSelected()) {
					// ctx save/restore because global alpha will ruin our day
					self.ctx.save();
					self.ctx.beginPath();
					self.ctx.rect(block.x, block.y, block.size('x'), block.size('y'));
					self.ctx.fillStyle = 'white';
					self.ctx.globalAlpha = 0.2;
					self.ctx.fill();
					self.ctx.restore();

					// Now render the stroke
					self.ctx.beginPath();
					self.ctx.lineWidth = 2;
					self.ctx.strokeStyle = 'black';
					self.ctx.rect(block.x + 2, block.y + 2, block.size('x') - 4, block.size('y') - 4);
					self.ctx.stroke();
				}

				if (Config.debugObjects) {
					self.ctx.font = "12px Helvetica";
					self.ctx.textAlign = "center";
					self.ctx.textBaseline = "top";
					self.ctx.fillStyle = 'black';
					if (block.allow) {
						self.ctx.fillText(block.name, block.x + (block.size('x') / 2), block.y + (block.size('y') / 2));
					} else {
						self.ctx.fillText('[x] ' + block.name, block.x + (block.size('x') / 2), block.y + (block.size('y') / 2));
					}
					self.ctx.fillText(block.x + ', ' + block.y, block.x + (block.size('x') / 2), block.y + (block.size('y') / 2) + 12);
				}
			}
		}
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
	 		configureEntity,
	 		i;

		// Set the background images draw method
		background
			.onRender(function() {
				if (background.isReady()) {
					if (background.getImage()) {
						self.ctx.drawImage(background.getImage(), 0, 0);
					} else {
						self.ctx.beginPath();
						self.ctx.rect(background.x, background.y, background.size('x'), background.size('y'));
						self.ctx.fillStyle = background.color;
						self.ctx.fill();
					}
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
				var clickX = getOffsetX(event.pageX), // requires jQuery
					clickY = getOffsetY(event.pageY), // requires jQuery
					entityClicked,
					entityMinX,
					entityMinY,
					entityMaxX,
					entityMaxY,
					entity,
					checkEntity,
					e,
					c;

				// Loop through all the entities and decide what to do when clicked
				for(e in entities) {
					if (entities.hasOwnProperty(e)) {
						entity = entities[e];
						// Don't try to move the background
						if (entity.name !== 'background' && entity.name.indexOf('exit') !== 0) {
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
							}
						}
					}
				}

				// Determine if we're in a valid state (col / row) to move this entity
				entityMinX = selectedEntity.x,
				entityMinY = selectedEntity.y,
				entityMaxX = selectedEntity.size('x') + selectedEntity.x,
				entityMaxY = selectedEntity.size('y') + selectedEntity.y,
				entityClicked = false;

				// Determine if we're clicking in the row or col
				if (selectedEntity.movement === 'x') {
					entityClicked = (clickY >= entityMinY
									&& clickY <= entityMaxY);
				} else if (selectedEntity.movement === 'y') {
					entityClicked = (clickX >= entityMinX
									&& clickX <= entityMaxX);
				}

				if (entityClicked) {
					selectedEntity.scheduleMovement(clickX, clickY);
				}
			});
	
		// Loop through the entities and attach the render method
		for (i in entities) {
			if (entities.hasOwnProperty(i) && entities[i].name !== 'background') {
				entities[i].onRender(_onRenderBlock(entities[i]));
			}
		}
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
			throw "Could not find Entity '" + name + "'";
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
		// Load a level
		_loadLevel();
		// Add entities from the level configuration
		_addEntities();
		// Add render methods
		_configureEntities();
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
		var player = this.entity('player-1');
		this.setTurn(player);
	},

	/**
	 * Updates the game logic
	 * @param {Number} modifier
	 * @return void
	 */
	this.update = function(modifier) {
		_checkEntities(modifier);
	},

	/**
	 * Renders the current game states
	 * @return void
	 */
	this.render = function() {
		var e;

		// Render all the available entities
		for (e in entities) {
			if (entities.hasOwnProperty(e) && selectedEntity.name !== entities[e].name) {
				entities[e].render();
			}
		}

		// Ensure what we've selected is always on top
		selectedEntity.render();

		// Enable some debugging
		if (Config.debug) {
			this.ctx.fillStyle = "rgb(0,0,0)";
			this.ctx.font = "12px Helvetica";
			this.ctx.textAlign = "left";
			this.ctx.textBaseline = "top";
			this.ctx.fillText("Level: " + level.name, Config.bitsize / 4, Config.bitsize / 4);
			this.ctx.fillText("Selected: " + selectedEntity.name, Config.bitsize / 4, Config.bitsize - (Config.bitsize / 4));
			this.ctx.fillText("Turn: " + currentTurnEntity.name, Config.bitsize / 4, Config.bitsize / 2);
		}
		if (Config.debugFps) {
			this.ctx.fillStyle = "rgb(0,0,0)";
			this.ctx.font = "12px Helvetica";
			this.ctx.textAlign = "left";
			this.ctx.textBaseline = "top";
			this.ctx.fillText("FPS: " + this.getFPS(), (Config.bitsize * Config.gridsize) - Config.bitsize, Config.bitsize / 4);
		}
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

	this.timestamp = function() {
		return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
	},

	/**
	 * The main game loop
	 * @return void
	 */
	this.main = function() {
		now = this.timestamp();
		// Ensure that the max timeout is 1 second
		delta = Math.min(1, (now - last) / 1000);
		// Fixed timestep loop
		// @see http://gafferongames.com/game-physics/fix-your-timestep/
		while (delta > step) {
			delta = delta - step;
			self.update(step);
		}
		self.render(delta);
		last = now;
		// Request to do this again
		requestAnimationFrame(self.main);
	};

	return this;
};