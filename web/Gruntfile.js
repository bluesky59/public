module.exports = function(grunt) {
    // 配置
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        transport : {
            app : {
                files : [
                    {
                        cwd : 'js/src/',
                        src : ['*.js','**/*.js'],
                        filter : 'isFile',
                        dest : 'js/dest',
                        ext: '.js'
                    }
                ]
            }
        },
        uglify : {
            app : {
                files: [
                    {
                        expand: true,
                        cwd: 'js/dest/',
                        src: ['*.js','**/*.js','!*-debug.js','!**/*-debug.js'],
                        dest: 'js/dest/',
                        ext: '.js'
                    }
                ]
            }
        },
        clean : {
            spm : ['js/.build']
        }
    });
    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('build', ['transport:app','uglify:app', 'clean']);
};
