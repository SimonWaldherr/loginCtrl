module.exports = function(grunt) {
  bannerString = '/* * * * * * * * * *\n' +
                 ' *    loginCtrl    *\n' +
                 ' *  Version  0.12  *\n' +
                 ' *  License:  MIT  *\n' +
                 ' * Simon  Waldherr *\n' +
                 ' * * * * * * * * * */\n\n';
  gzip = require("gzip-js");
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: '\n\n'
      },
      dist: {
        src: ['./repos/majaX.js/majax.js', './repos/cryptofoo/cryptofoo.js', './repos/lightbox.js/tinybox.js', './js-css/script.js'],
        dest: './release/build/script.pre.js'
      }
    },
    uglify: {
      options: {
        banner: bannerString,
        footer: '\n\n\n\n /* foo */'
      },
      dist: {
        files: {
          './release/build/script.pre.js': ['./release/build/script.pre.js']
        }
      }
    },
    cssmin: {
      add_banner: {
        options: {
          banner: bannerString
        },
        files: {
          './release/build/style.pre.css': ['./repos/BaF-Framework/css/baf.css', './js-css/style.css', './js-css/popover.css']
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);
};
