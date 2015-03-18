module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			dist: {
				files : {
					'jquery.tabs.min.js': ['src/jquery.tabs.js'],
				}
			}
		},

		uglify: {
			dist: {
				files: {
					'jquery.tabs.min.js' : ['jquery.tabs.min.js']
				},
				options: {
					preserveComments : 'some'
				}
			}
		},

		jshint: {
			all: [
				'Gruntfile.js',
				'src/*.js'
			],
			options: {
				curly: false,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true,
				jquery: true,

				globals: {
					module: true,
					require: true,
					jQuery: true,
					console: true,
					define: true
				}
			}
		},

		sass: {
			dist: {
				options: {
					style: 'compressed',
					sourcemap: 'none',
					compass: false,
					lineNumbers: true,
					update: true
				},
				files: {
					'tabs.min.css': 'src/tabs.scss'
				}
			}
		},

		watch: {
			jshint: {
				files: [
					'src/*.js'
				],
				tasks: [
					'jshint'
				]
			},
			concat: {
				files: [
					'src/*.js'
				],
				tasks: [
					'concat'
				]
			},
			uglify: {
				files: [
					'src/*.js',
				],
				tasks: [
					'uglify'
				]
			},
			css: {
				files: [
					'src/*.scss'
				],
				tasks: ['sass'],
				options: {
					spawn: false,
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', [
		'sass',
		'concat',
		'uglify'
	]);

};