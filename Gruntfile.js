(function () {

    'use strict';

    module.exports = function (grunt) {

        // Load grunt tasks automatically
        require('load-grunt-tasks')(grunt);

        var appConfig = {
            app: require('./bower.json').appPath || 'app',
            build: 'build',
            mocks: 'mocks',
            tmp: 'tmp'
        };

        // Project configuration
        grunt.initConfig({
            appConfig: appConfig,
            pkg: grunt.file.readJSON('package.json'),

            // Before generating any new files, remove any previously-created files.
            clean: {
                build: ['<%=appConfig.build%>']
            },

            // Copy existing files to 'build'
            copy: {
                bower_components: {
                    cwd: '<%=appConfig.app%>/bower_components/',
                    src: '**',
                    dest: '<%=appConfig.build%>/bower_components',
                    expand: true
                },
                images: {
                    cwd: '<%=appConfig.app%>/images/',
                    src: '**',
                    dest: '<%=appConfig.build%>/images',
                    expand: true
                }
            },

            // Star up a node express server
            express: {
                dev: {
                    options: {
                        script: 'server/server.js'
                    }
                }
            },

            // Compile jade files
            jade: {
                options: {
                    pretty: true,
                    client: false,
                    basePath: '<%=appConfig.app%>/jade',
                    data: {
                        debug: true
                    }
                },
                views: {
                    files: [{
                        expand: true,
                        cwd: '<%=appConfig.app%>/jade',
                        src: [
                            '{,**/}*.jade',
                            '!{,**/}mixins/*.jade',
                            '!{,**/}layouts/*.jade',
                            '!{,**/}includes/*.jade',
                        ],
                        dest: '<%=appConfig.build%>/views',
                        ext: '.html',
                        extDot: 'last'
                    }]
                },
                // templates: {
                //     files: [{
                //         expand: true,
                //         cwd: '<%=appConfig.app%>/scripts/templates',
                //         src: ['{,**/}*.jade'],
                //         dest: '<%=appConfig.build%>/scripts/templates',
                //         ext: '.html',
                //         extDot: 'last'
                //     }]
                // },
                directives: {
                    files: [{
                        expand: true,
                        cwd:'<%=appConfig.app%>/scripts/directives',
                        src: ['{,**/}*.jade'],
                        dest: '<%=appConfig.build%>/scripts/directives',
                        ext: '.html',
                        extDot: 'last'
                    }]
                },
                index: {
                    files: [{
                        expand: true,
                        cwd: '<%=appConfig.app%>',
                        src: 'index.jade',
                        dest: '<%=appConfig.build%>',
                        ext: '.html'
                    }]
                }
            },

            // Compile sass files
            sass: {
                dist: {
                    options: {
                        noCache: true,
                        trace: true,
                        lineNumbers: true
                    },
                    files: [{
                        '<%=appConfig.build%>/styles/main.css': '<%=appConfig.app%>/sass/main.scss'
                    }]
                }
            },

            // Validate all the javascript files
            jshint: {
                options: {
                    jshintrc: '.jshintrc'
                },
                all: {
                    src: ['Gruntfile.js', '<%=appConfig.app%>/scripts/{,**/}*.js']
                }
            },

            // Inject all dependencies
            injector: {
                options: {
                    addRootSlash: true
                },
                local_dependencies: {
                    options: {
                        ignorePath: ['<%=appConfig.build%>']
                    },
                    files: {
                        '<%=appConfig.build%>/index.html': [
                            '<%=appConfig.build%>/styles/main.css',
                            '<%=appConfig.build%>/scripts/{,**/}*.module.js',
                            '<%=appConfig.build%>/scripts/{,**/}*.js',
                        ]
                    }
                },
                bower_dependencies: {
                    options: {
                        ignorePath: ['<%=appConfig.app%>'],
                        starttag: '<!-- bower_injector:{{ext}} -->',
                        endtag: '<!-- bower_endinjector -->'
                    },
                    files: {
                        '<%=appConfig.build%>/index.html': ['bower.json']
                    }
                }
            },

            // ngAnnotate
            ngAnnotate: {
                options: {
                    singleQuotes: true
                },
                app: {
                    files: [{
                        cwd: '<%=appConfig.app%>/scripts',
                        src: '{,**/}*.js',
                        dest: '<%=appConfig.build%>/scripts',
                        expand: true
                    }]
                }
            },

            // Compile html2js
            html2js: {
                main: {
                    options: {
                        base: '<%=appConfig.build%>/scripts',
                        module: 'switchApp.templates'
                    },
                    src: ['<%=appConfig.build%>/scripts/**/*.tpl.html'],
                    dest: '<%=appConfig.build%>/scripts/tpl/templates.js'
                }
            },

            // Watch for changes on files
            watch: {
                options: {
                    livereload: true
                },
                jadeviews: {
                    files: ['<%=appConfig.app%>/jade/{,**/}*.jade'],
                    tasks: ['jade:views']
                },
                jadeindex: {
                    files: ['<%=appConfig.app%>/index.jade'],
                    tasks: ['jade:index', 'injector']
                },
                sass: {
                    files: ['<%=appConfig.app%>/sass/{,**/}*.scss'],
                    tasks: ['sass']
                },
                js: {
                    files: ['<%=appConfig.app%>/scripts/{,**/}*.js'],
                    tasks: ['newer:jshint:all', 'newer:ngAnnotate']
                }
            },

            // Bind the express server
            connect: {
                server: {
                    options: {
                        port: 9000,
                        hostname: 'localhost',
                        base: '<%=appConfig.build%>',
                        open: {
                            target: 'http://localhost:9000/'
                        },
                        livereload: true
                    }
                }
            }
        });

        // Server Tasks
        grunt.registerTask('serve', [
            'clean',
            'jshint',
            'copy',
            'ngAnnotate',
            'jade',
            'html2js',
            'sass',
            'injector',
            // 'express',
            'connect',
            'watch'
        ]);

        // By default
        grunt.registerTask('default', ['serve']);

    };

})();