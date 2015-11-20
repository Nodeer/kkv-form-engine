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
    stage: {
      constants: {
        API_URL: 'http://live-nettineuvoja.sites.nordsoftware.com/api/v1.0',
        ENVIRONMENT: 'staging'
      }
    },
    prod: {
      constants: {
        API_URL: 'http://live-nettineuvoja.sites.nordsoftware.com/api/v1.0',
        ENVIRONMENT: 'production',
        FROM_EMAIL: 'noreply@nettineuvoja.fi'
      }
    }
  };
};
