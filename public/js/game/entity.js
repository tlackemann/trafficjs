/**
 * Traffic Game
 *
 * @package		Traffic
 * @version		1.0.0
 * @author		Thomas Lackemann <tommylackemann@gmail.com>
 * @copyright	Copyright (c) 2014, Thomas Lackemann
 */

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
	 * If we're ready for processing
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

	maxLimitX = false,
	maxLimitY = false,
	minLimitX = false,
	minLimitY = false,

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
	}(),

	/**
	 * The method to run when a collision is returned
	 * @protected
	 * @var {Function}
	 */
	collideMethod = function(entity) {
		if (self.movement === 'x') {
			if ((!maxLimitX || (maxLimitX && maxLimitX < entity.x)) && entity.x === self.x + self.size('x') && (self.y === entity.y || self.y < entity.y + entity.size('y'))) {
				maxLimitX = entity.x;
			}
			if ((!minLimitX || (minLimitX && minLimitX > entity.x)) && entity.x + entity.size('x') === self.x && (self.y === entity.y || (self.y < entity.y + entity.size('y') && self.y + self.size('y') > entity.y))) {
				minLimitX = self.x;
			}
			// console.log(maxLimitX, minLimitX);
		}

		if (self.movement === 'y') {
			if ((!maxLimitY || (maxLimitY && maxLimitY < entity.y)) && entity.y === self.y + self.size('y') && (self.x === entity.x || self.x < entity.x + entity.size('x'))) {
				maxLimitY = entity.y;
			}
			if ((!minLimitY || (minLimitY && minLimitY > entity.y)) && entity.y + entity.size('y') === self.y && (self.x === entity.x || (self.x < entity.x + entity.size('x') && self.x + self.size('x') > entity.x))) {
				minLimitY = self.y;
			}
			// console.log(maxLimitY, minLimitY);
		}

	};

	/**
	 * Name of the entity 
	 * @var {String}
	 */
	this.name = options.name || '',

	/**
	 * Color of the block
	 * @var {String}
	 */
	this.color = options.color || 'blue',

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
	 * Moveable
	 * @var {Boolean}
	 */
	this.moveable = options.moveable || true,

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
	 * Checks if this Entity is colliding with another Entity
	 * Should prevent the Entity from moving further
	 * @param {Entity} entity
	 * @param {Entity} checkEntity
	 * @return {Boolean}
	 */
	this.checkCollision = function(checkEntity) {
		if (!(checkEntity.x > this.x + this.size('x')
			|| checkEntity.x + checkEntity.size('x') < this.x
			|| checkEntity.y > this.y + this.size('y')
			|| checkEntity.y + checkEntity.size('y') < this.y))
		{
			collideMethod(checkEntity);
			return true;
		}

		return false;
	},

	/**
	 * Render the Entity based on the renderMethod
	 * @return void
	 */
	this.render = function() {
		renderMethod();
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
			scheduledY = this.scheduledY,
			entity,
			e;

		if (this.moveable) {

			// @todo - This is bad because if we ever create a 1x1 Entity, they will only be able to move
			// x|y but not both, might be useful for moving "powerups" around the map so the players can
			// reach them by moving other pieces
			if (selected && processing && (scheduledX !== false || scheduledY !== false)) {
				
				if (this.movement === 'x') {

					// Move forward  X
					if (scheduledX > x + this.size('x') && (!maxLimitX || x + this.size('x') < maxLimitX)) {
						this.x += this.speed * modifier;
					}
					// Move backward X
					else if (scheduledX - Config.bitsize < x && (!minLimitX || x > minLimitX)) {
						this.x -= this.speed * modifier;
					}
					// Done moving
					if (scheduledX - Config.bitsize == Math.ceil(x) || scheduledX - Config.bitsize == Math.floor(x)) {
						this.x = scheduledX - Config.bitsize;
						this.scheduledX = false;
						//processing = false;
					}
					if (scheduledX == Math.ceil(x) + this.size('x') || scheduledX == Math.floor(x) + this.size('x')) {
						this.x = scheduledX - this.size('x');
						this.scheduledX = false;
						//processing = false;
					}


				} else if (this.movement === 'y') {
					// Move forward Y
					if (scheduledY > y + this.size('y') && (!maxLimitY || y + this.size('y') < maxLimitY)) {
						this.y += this.speed * modifier;
					}
					// Move backward Y
					else if (scheduledY - Config.bitsize < y && (!minLimitY || y > minLimitY)) {
						this.y -= this.speed * modifier;
					}
					// Done moving
					if (scheduledY - Config.bitsize == Math.ceil(y) || scheduledY - Config.bitsize == Math.floor(y)) {
						this.y = scheduledY - Config.bitsize;
						this.scheduledY = false;
						//processing = false;
					}
					if (scheduledY == Math.ceil(y) + this.size('y') || scheduledY == Math.floor(y) + this.size('y')) {
						this.y = scheduledY - this.size('y');
						this.scheduledY = false;
						//processing = false;
					}
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
	 * @return {Object|Boolean}
	 */
	this.getImage = function() {
		return (imageSrc) ? image : false;
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
		selected = false;
		scheduledX = false;
		scheduledY = false;
		maxLimitX = false;
		maxLimitY = false;
		minLimitX = false;
		minLimitY = false;
		processing = false;

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
		var scheduledX = Math.ceil(x/Config.bitsize) * Config.bitsize,
			scheduledY = Math.ceil(y/Config.bitsize) * Config.bitsize,
			entity,
			e;
		// If the Entity is selected, schedule the movement
		if (selected && processing) {
			// Snap the x,y coordinates to the size of the grid
			if (this.movement.toLowerCase() === 'x') {
				this.scheduledX = scheduledX;
			} else if (this.movement.toLowerCase() === 'y') {
				this.scheduledY = scheduledY;
			}
		} else if (!processing) {
			// Now that we've told the Entity to move to a new location
			// set processing to true so we know we can move it
			processing = true;
		}
		return this;
	},

	/**
	 * Perform preload activity
	 * @return {Entity}
	 */
	this.start = function() {
		// Calculate the actual location of the block based on the x and y
		this.x = this.x * Config.bitsize;
		this.y = this.y * Config.bitsize;

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