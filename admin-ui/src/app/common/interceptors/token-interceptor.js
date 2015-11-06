angular.module('nnAdmin')
  .factory('tokenInterceptor', function($log, $q, $injector, _) {
    var urlRetryQueue = [];

    /**
     * Checks if the auth token should be refreshed.
     * @param {Object} response
     * @returns {boolean}
     */
    function shouldRefreshToken(response) {
      var AuthService = $injector.get('AuthService');
      return response.status === 401 && AuthService.hasRefreshToken() && isUrlInQueue(response);
    }

    /**
     * Checks if a request URL exists in the queue.
     * @param {Object} response
     * @return {boolean}
     */
    function isUrlInQueue(response) {
      return _.contains(urlRetryQueue, response.config.url);
    }

    /**
     * Checks if an Authorization header should be excluded from a request.
     * @param {Object} config
     * @return {boolean}
     */
    function shouldExcludeAuthorizationHeader(config) {
      var isUrlUserLogin = _.contains(config.url, 'login');
      var isTemplateUrl = _.contains(config.url, '.html');
      return isUrlUserLogin && isTemplateUrl;
    }

    return {
      /**
       * @param {object} config
       * @returns {object}
       */
      request: function(config) {
        config.headers = config.headers || {};

        var AuthService = $injector.get('AuthService');
        var authToken = AuthService.getAccessToken();

        if (!shouldExcludeAuthorizationHeader(config) && authToken) {
          config.headers.Authorization = 'Bearer ' + authToken;
        }

        return config;
      },
      /**
       * @param {object} response
       * @returns {Promise}
       */
      response: function(response) {
        return response || $q.when(response);
      },
      /**
       * @param {object} response
       * @returns {Promise}
       */
      responseError: function(response) {
        var dfd = $q.defer();
        var $state = $injector.get('$state');
        var AuthService = $injector.get('AuthService');
        var ApiService = $injector.get('ApiService');

        if (response.status !== 401) {
          return $q.reject(response);

        }

        if (response.config.url === ApiService.getRefreshTokenUrl()) {
          AuthService.logout();

          dfd.reject(response);

          $state.go('login');
        }

        urlRetryQueue.push(response.config.url);

        if (shouldRefreshToken(response)) {
          AuthService.refreshToken()
            .then(function() {
              // Retry request
              ApiService.sendRequest(response.config)
                .then(function(retryResponse) {
                  dfd.resolve(retryResponse);
                }, function() {
                  dfd.reject(response);
                });
            }, function() {
              dfd.reject(response);
            })
            .finally(function() {
              _.remove(urlRetryQueue, response.config.url);
            });
        }

        return dfd.promise;
      }
    };
  })
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('tokenInterceptor');
  });
