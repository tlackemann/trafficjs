/**
 * Traffic Game
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
		 * The method to run when render() is called
		 * @protected
		 * @var {Function}
		 */
		var renderMethod = function() {};

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
		this.ctx = this.canvas.getContext('2d');

		/**
		 * Check if keys are pressed during update()
		 * @protected
		 * @param {Number} modifier
		 * @return void
		 */
		var _checkKeys = function(modifier) {
			if (38 in keysDown) { // Player holding up
				self.entity('hero').y -= self.entity('hero').speed * modifier;
			}
			if (40 in keysDown) { // Player holding down
				self.entity('hero').y += self.entity('hero').speed * modifier;
			}
			if (37 in keysDown) { // Player holding left
				self.entity('hero').x -= self.entity('hero').speed * modifier;
			}
			if (39 in keysDown) { // Player holding right
				self.entity('hero').x += self.entity('hero').speed * modifier;
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
				self.entity('hero').x <= (self.entity('monster').x + 32)
				&& self.entity('monster').x <= (self.entity('hero').x + 32)
				&& self.entity('hero').y <= (self.entity('monster').y + 32)
				&& self.entity('monster').y <= (self.entity('hero').y + 32)
			) {
				//++monstersCaught;
				self.reset();
			}
		};

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
			// Set the background images draw method
			this.entity('background').onRender(function() {
				var background = self.entity('background');
				if (background.isReady()) {
					self.ctx.drawImage(self.entity('background').getImage(), 0, 0);
				}
			});

			// Hero image
			this.setEntity('hero', {
				imageSrc: 'images/hero.png',
				speed: 256
			});
			// Set the heros images draw method
			this.entity('hero').onRender(function() {
				var hero = self.entity('hero');
				if (hero.isReady()) {
					self.ctx.drawImage(hero.getImage(), hero.x, hero.y);
				}
			});

			// Monster image
			this.setEntity('monster', {
				imageSrc: 'images/monster.png'
			});
			// Set the monster images draw method
			this.entity('monster').onRender(function() {
				var monster = self.entity('monster');
				if (monster.isReady()) {
					self.ctx.drawImage(monster.getImage(), monster.x, monster.y);
				}
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
			_checkKeys(modifier);
			_checkCollision(modifier);
		},

		/**
		 * Renders the current game states
		 * @return void
		 */
		this.render = function() {
			this.entity('background').render();
			this.entity('hero').render();
			this.entity('monster').render();

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