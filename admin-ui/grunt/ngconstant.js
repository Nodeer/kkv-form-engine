module.exports = function (grunt, options) {
    var pkg = grunt.file.readJSON('package.json');

    return {
        options: {
            name: 'nnAdmin.constants',
            dest: '<%= build %>/js/config.js',
            wrap: "'use strict';\n\n{%= __ngModule %}",
            constants: {
                API_URL: 'http://api.kkv.dev',
                API_VERSION: 'v1',
                OAUTH2_CLIENT_ID: 'kkv-form-engine',
                OAUTH2_CLIENT_SECRET: 'FpfqCBp7HO1+5I3R83mLfl2jjkEUucIeyxjNVnq9zQA=',
                FLOWCHART_URL: 'http://yuml.me/diagram/plain/class/',
                DEBUG: false,
                VERSION: pkg.version
            }
        },
        dev: {
            constants: {
                DEBUG: true
            }
        },
        prod: {
            constants: {
                API_URL: 'http://ec2-52-31-144-132.eu-west-1.compute.amazonaws.com'
            }
        }
    };
};
