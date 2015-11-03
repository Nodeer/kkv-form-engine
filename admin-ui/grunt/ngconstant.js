module.exports = function (grunt, options) {
    var pkg = grunt.file.readJSON('package.json');

    return {
        options: {
            name: 'nnAdmin.constants',
            dest: '<%= build %>/js/config.js',
            wrap: "'use strict';\n\n{%= __ngModule %}",
            constants: {
                API_URL: 'http://api.kkv.dev/v1',
                FLOWCHART_URL: 'http://yuml.me/diagram/scruffy/class/',
                DEBUG: false,
                VERSION: pkg.version
            }
        },
        dev: {
            constants: {
                DEBUG: true
            }
        },
        stage: {
            constants: {
                API_URL: 'http://live-nettineuvoja.sites.nordsoftware.com/api/v1.0'
            }
        },
        prod: {
            constants: {
                API_URL: 'http://live-nettineuvoja.sites.nordsoftware.com/api/v1.0'
            }
        }
    };
};
