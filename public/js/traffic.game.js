/**
 * Script file for handling basic UX
 *
 * @package		Traffic
 * @version		1.0.0
 * @author		Thomas Lackemann <tommylackemann@gmail.com>
 * @copyright	Copyright (c) 2014, Thomas Lackemann
 */

(function() {
	var TrafficGame = null;

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
		 * Speed
		 * @var {Number}
		 */
		this.speed = options.speed || 0,

		/**
		 * Draw the entity
		 * @return {Entity}
		 */
		this.draw = function() {
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
		 * Perform preload activity
		 * @return {Entity}
		 */
		this.start = function() {
			// Set the image src if there is one
			if (imageSrc) {
				image.src = imageSrc;
			}
			// When the image is ready, we're ready
			image.onload = function() {
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
		 * Canvas element
		 * @var {Object}
		 */
		this.canvas = document.getElementById("traffic-canvas"),

		/**
		 * CTX object
		 * @var {Object}
		 */
		this.ctx = this.canvas.getContext('2d'),

		/**
		 * Sets and starts a new Entity
		 * @param {String} name
		 * @param {Object} options
		 * @return {Entity}
		 */
		this.setEntity = function(name, options) {
			entities[name] = new Entity(options);
			entities[name].start();
			return entities[name];
		},

		/**
		 * Returns an available Entity object
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
		 * Load the entities and starts the game loop
		 * @return void
		 */
		this.start = function() {
			// Background image
			this.setEntity('background', {
				imageSrc: 'images/background.png'
			});
			// Hero image
			this.setEntity('hero', {
				imageSrc: 'images/hero.png',
				speed: 256
			});
			// Monster image
			this.setEntity('monster', {
				imageSrc: 'images/monster.png'
			});

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
			this.entity('hero').x = this.canvas.width / 2;
			this.entity('hero').y = this.canvas.height / 2;

			// Throw the monster somewhere on the screen randomly
			this.entity('monster').x = 32 + (Math.random() * (this.canvas.width - 64));
			this.entity('monster').y = 32 + (Math.random() * (this.canvas.height - 64));
		},

		/**
		 * Updates the game logic
		 * @param {Number} modifier
		 * @return void
		 */
		this.update = function(modifier) {
			if (38 in keysDown) { // Player holding up
				this.entity('hero').y -= this.entity('hero').speed * modifier;
			}
			if (40 in keysDown) { // Player holding down
				this.entity('hero').y += this.entity('hero').speed * modifier;
			}
			if (37 in keysDown) { // Player holding left
				this.entity('hero').x -= this.entity('hero').speed * modifier;
			}
			if (39 in keysDown) { // Player holding right
				this.entity('hero').x += this.entity('hero').speed * modifier;
			}

			// Are they touching?
			if (
				this.entity('hero').x <= (this.entity('monster').x + 32)
				&& this.entity('monster').x <= (this.entity('hero').x + 32)
				&& this.entity('hero').y <= (this.entity('monster').y + 32)
				&& this.entity('monster').y <= (this.entity('hero').y + 32)
			) {
				//++monstersCaught;
				this.reset();
			}
		},

		/**
		 * Renders the current game states
		 * @return void
		 */
		this.render = function() {
			var hero = this.entity('hero'),
				monster = this.entity('monster'),
				background = this.entity('background');

			if (background.isReady()) {
				this.ctx.drawImage(background.getImage(), 0, 0);
			}

			if (hero.isReady()) {
				this.ctx.drawImage(hero.getImage(), hero.x, hero.y);
			}

			if (monster.isReady()) {
				this.ctx.drawImage(monster.getImage(), monster.x, monster.y);
			}

			// Score
			this.ctx.fillStyle = "rgb(250, 250, 250)";
			this.ctx.font = "24px Helvetica";
			this.ctx.textAlign = "left";
			this.ctx.textBaseline = "top";
			//this.ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
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