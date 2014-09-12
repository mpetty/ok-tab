module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			dist: {
				files : {
					'jquery.fillSelect.min.js': ['src/jquery.fillSelect.js'],
					'jquery.fillSelect.methods.min.js': ['src/jquery.fillSelect.methods.js'],
				}
			}
		},

		uglify: {
			dist: {
				files: {
					'jquery.fillSelect.min.js' : ['jquery.fillSelect.min.js'],
					'jquery.fillSelect.methods.min.js' : ['jquery.fillSelect.methods.min.js']
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

		watch: {
			jshint: {
				files: [
					'src/*.js'
				],
				tasks: [
					'jshint'
				]
			},
			uglify: {
				files: [
					'src/*.js',
				],
				tasks: [
					'uglify'
				]
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['concat', 'uglify']);

};