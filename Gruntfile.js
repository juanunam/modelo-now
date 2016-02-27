'use strict';

module.exports = (Grunt) => {
	Grunt.initConfig({
		jade: {
			debug: {
				options: { pretty: true },
				files: {
					'public/index.html': ['src/views/index.jade']
				}
			},
			release: {
				options: { pretty: false },
				files: {
					'public/index.html': ['src/views/index.jade']
				}
			}
		}
	});

	Grunt.loadNpmTasks('grunt-contrib-jade');
	
	Grunt.registerTask('compile', ['jade:debug']);
};

