/**
 * Configuration file
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
   "game": {
      // Game settings go here
   },
   "server": {
      "port": 1234
   },
   "redis": {
      "host": "localhost",
      "port": 6379,
      "db": "traffic-dev",
      "pass": "",
      "secret": "change-this-secret",
      "cookie": {  
         "path": "/",
         "maxAge": 3600000
      }
   }
}