module.exports = function(grunt, options) {
  var pkg = grunt.file.readJSON('package.json');

  return {
    options: {
      name: 'nettineuvoja.constants',
      dest: '<%= build %>/js/config.js',
      wrap: "'use strict';\n\n{%= __ngModule %}",
      constants: {
        APP_NAME: 'Nettineuvoja',
        API_URL: 'http://api.kkv.dev',
        API_VERSION: 'v1',
        DEBUG: false,
        VERSION: pkg.version,
        ENVIRONMENT: 'development',
        FROM_EMAIL: 'noreply@nettineuvoja.dev'
      }
    },
    dev: {
      constants: {
        DEBUG: false
      }
    },
    prod: {
      constants: {
        API_URL: 'http://ec2-52-31-144-132.eu-west-1.compute.amazonaws.com',
        ENVIRONMENT: 'production',
        FROM_EMAIL: 'noreply@nettineuvoja.fi'
      }
    }
  };
};
