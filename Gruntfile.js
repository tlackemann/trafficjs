module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: [
          'public/js/game/config.js',
          'public/js/game/levels/*.js',
          'public/js/game/entity.js',
          'public/js/game/traffic.js'
        ],
        dest: 'public/js/traffic.min.js'
      }
    },
    watch: {
      scripts: {
        files: ['public/js/game/*.js'],
        tasks: ['default'],
        options: {
          spawn: false,
        },
      },
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};