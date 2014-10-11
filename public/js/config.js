var Config = {
	id: "traffic-canvas",
	bitsize: 64,
	gridsize: 7,
	defaultSpeed: 200,
	/**
	 * Enables debugging text output on the render() method
	 */
	debug: true,
	debugFps: true,
	debugObjects: true,

	// @todo - should load from a random map, maybe fetch from a server?
	levels: [
		{
			name: 'Testing Grounds',
			background: 'lightgrey',
			objects: {
				/* Required */
				'player-1': {
					blocks: {
						x: 2,
						y: 1
					},
					// imageSrc: 'images/monster.png',
					x: 2,
					y: 2,
					movement: 'x',
					color: 'firebrick'
				},
				/* Required */
				'player-2': {
					blocks: {
						x: 2,
						y: 1
					},
					x: 4,
					y: 5,
					movement: 'x',
					color: 'firebrick'

				},
				'truck-1': {
					blocks: {
						x: 3,
						y: 1
					},
					x: 0,
					y: 0,
					movement: 'x',
					color: '#1485CC'
				},
				'truck-2': {
					blocks: {
						x: 1,
						y: 3
					},
					x: 1,
					y: 4,
					movement: 'y',
					color: 'dodgerblue'
				},
				'truck-3': {
					blocks: {
						x: 3,
						y: 1
					},
					x: 4,
					y: 6,
					movement: 'x',
					color: 'slategray'
				},
				'truck-4': {
					blocks: {
						x: 1,
						y: 3
					},
					x: 4,
					y: 0,
					movement: 'y',
					color: 'gold'
				},
				'truck-5': {
					blocks: {
						x: 1,
						y: 3
					},
					x: 6,
					y: 3,
					movement: 'y',
					color: 'plum'
				},
				'car-1': {
					blocks: {
						x: 1,
						y: 2
					},
					movement: 'y',
					x: 0,
					y: 1,
					color: 'purple'
				},
				'car-2': {
					blocks: {
						x: 2,
						y: 1
					},
					movement: 'x',
					x: 1,
					y: 1,
					color: 'pink'
				},
				'car-3': {
					blocks: {
						x: 2,
						y: 1
					},
					movement: 'x',
					x: 0,
					y: 3,
					color: 'green'
				},
				'car-4': {
					blocks: {
						x: 2,
						y: 1
					},
					movement: 'x',
					x: 2,
					y: 6,
					color: 'palegreen'
				},
				'car-5': {
					blocks: {
						x: 1,
						y: 2
					},
					movement: 'y',
					x: 3,
					y: 0,
					color: 'peru'
				},
				'car-6': {
					blocks: {
						x: 1,
						y: 2
					},
					movement: 'y',
					x: 6,
					y: 0,
					color: 'seagreen'
				}
			}
		}
	]
};