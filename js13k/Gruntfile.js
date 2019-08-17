module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
        files: [{
          expand: false,
          src: 'assets/js/*.js',
          dest: 'dst/game.min.js',
          ext: '.min.js'
        }]
      }
    },
    watch: {
      files: ['assets/js/*.js'],
      tasks: ['uglify']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify-es');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['uglify']);
};
