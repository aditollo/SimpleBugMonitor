module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				boss: true
			},
			files: ['Gruntfile.js', 'src/*.js']
		},
		compress: {
			main: {
				options: {
					archive: 'dist/<%= pkg.name %>-<%= pkg.version %>.zip'
				},
				files: [
					{ src: ['src/**'] }
				]
			}
		},
		updateManifest: {}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.registerTask('updateManifest', 'Aggiorna il file manifest', function (key, value) {
        var manifestFile = "src/manifest.json";
        var package = grunt.file.readJSON('./package.json');

        if (!grunt.file.exists(manifestFile)) {
            grunt.log.error("file " + manifestFile + " not found");
            return false;
        }

        var manifest = grunt.file.readJSON(manifestFile);

        manifest.version = package.version;

        grunt.file.write(manifestFile, JSON.stringify(manifest, null, 2));

    });

	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('build', ['jshint', 'updateManifest', 'compress']);

};