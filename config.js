/**
 * Configuration file for express server
 *
 * @package    Traffic
 * @version    1.0.0
 * @author     Thomas Lackemann <tommylackemann@gmail.com>
 * @copyright  Copyright (c) 2014, Thomas Lackemann
 */

module.exports = {  
	"version": "1.0.0",
	"debug": true,
	"log": true,
	// Traffic Settings
	"game": {
	},
	// Express Settings
	"server": {
		"port": 1234
	},
	// MongoDB Settings
	"database": {
		"host":"127.0.0.1",
        "port":27017,
        "username":"",
        "password":"",
        "dbname":"traffic_development"
	}
}