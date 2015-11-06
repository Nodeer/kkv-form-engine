angular.module('nnAdmin')
  .constant('AuthEvent', {
    'USER_LOGIN': 'user_login',
    'USER_LOGOUT': 'user_logout',
    'USER_SAVED': 'auth_user_saved',
    'USER_REMOVED': 'auth_user_removed'
  })
  .constant('AuthError', {
    'ACCESS_DENIED': 'access_denied'
  })
  .factory('AuthService', function($log, $rootScope, $q, $http, $httpParamSerializer, _, ApiService, StorageService, AuthEvent, AuthError) {
    var STORAGE_KEY = {
      USER: 'user',
      ACCESS_TOKEN: 'accessToken',
      REFRESH_TOKEN: 'refreshToken'
    };

    // Flag for whether or not the user is authenticated.
    var _authenticated = false;

    /**
     * Authenticates a user.
     * @param {string} username
     * @param {string} password
     * @return {promise}
     */
    function login(username, password) {
      var dfd = $q.defer();

      var data = $httpParamSerializer({
        grant_type: 'password',
        client_id: ApiService.getOAuth2ClientId(),
        client_secret: ApiService.getOAuth2ClientSecret(),
        username: username,
        password: password
      });

      ApiService.login(data)
        .then(function(response) {
          var accessToken = _tryGetAccessToken(response);
          var refreshToken = _tryGetRefreshToken(response);

          _saveAccessToken(accessToken);
          _saveRefreshToken(refreshToken);

          ApiService.getUser()
            .then(function(response) {
              _authenticated = true;

              $rootScope.$broadcast(AuthEvent.USER_LOGIN, response);

              _saveUser(response.data.data);

              dfd.resolve(response);
            }, function(err) {
              _removeAccessToken();
              _removeRefreshToken();

              dfd.reject(err);
            });
        }, function(err) {
          dfd.reject(err);
        });

      return dfd.promise;
    }

    /**
     * Auto-authenticates a user with an auth token.
     * @return {promise}
     */
    function authenticate() {
      var dfd = $q.defer();

      if (!isAuthenticated() && hasAccessToken()) {
        ApiService.validateToken()
          .then(function(response) {
            _authenticated = true;

            $rootScope.$broadcast(AuthEvent.USER_LOGIN, response);

            dfd.resolve(response);
          }, function(error) {
            logout();

            dfd.reject(error);
          });
      } else {
        dfd.resolve();
      }

      return dfd.promise;
    };

    /**
     * Refreshes an access token.
     * @return {promise}
     */
    function refreshToken() {
      var dfd = $q.defer();

      var data = $httpParamSerializer({
        refresh_token: _getRefreshToken(),
        client_id: ApiService.getOAuth2ClientId(),
        client_secret: ApiService.getOAuth2ClientSecret(),
        grant_type: 'refresh_token'
      });

      ApiService.refreshToken(data)
        .then(function(response) {
          var accessToken = _tryGetAccessToken(response);
          var refreshToken = _tryGetRefreshToken(response);

          $log.debug('Access token refreshed:', accessToken);

          _saveAccessToken(accessToken);
          _saveRefreshToken(refreshToken);

          dfd.resolve(accessToken);
        }, function(error) {
          dfd.reject(error);
        });

      return dfd.promise;
    }

    /**
     * Logs out the authenticated user.
     */
    function logout() {
      _authenticated = false;

      _removeAccessToken();
      _removeRefreshToken();
      _removeUser();

      $rootScope.$broadcast(AuthEvent.USER_LOGOUT);
    }

    /**
     * Attempts to auto-login and checks if the user is authenticated.
     * Use as a state resolve condition when requiring authentication.
     * @return {promise}
     */
    function ensureAuthenticated() {
      var dfd = $q.defer();

      authenticate()
        .finally(function() {
          if (isAuthenticated()) {
            dfd.resolve();
          } else {
            dfd.reject(AuthError.ACCESS_DENIED);
          }
        });

      return dfd.promise;
    }

    /**
     * Returns saved profile meta data.
     * @return {Object}
     */
    function getUser() {
      return StorageService.getValue(STORAGE_KEY.USER);
    }

    /**
     * Returns the logged in users id.
     * @returns {string}
     */
    function getId() {
      var user = getUser();
      return user ? _.get(user, 'id') : null;
    }

    /**
     * Checks if a user is authenticated.
     * @return {boolean}
     */
    function isAuthenticated() {
      return _authenticated;
    }

    /**
     * Saves user profile meta data.
     * @param {Object} user
     */
    function _saveUser(user) {
      StorageService.setValue(STORAGE_KEY.USER, user);

      $rootScope.$broadcast(AuthEvent.USER_SAVED);

      $log.debug('User saved:', user);
    }

    /**
     * Deletes user profile meta data.
     */
    function _removeUser() {
      StorageService.removeValue(STORAGE_KEY.USER);

      $rootScope.$broadcast(AuthEvent.USER_REMOVED);

      $log.debug('User removed.');
    }

    /**
     * Returns the access token from the given response or throws an error.
     * @param {object} response
     * @returns {string}
     */
    function _tryGetAccessToken(response) {
      var token = _.get(response, 'data.access_token');

      if (!token) {
        throw new Error('Response does not contain an access token.');
      }

      return token;
    }

    /**
     * Stores an auth token.
     * @param {string} token
     */
    function _saveAccessToken(token) {
      StorageService.setValue(STORAGE_KEY.ACCESS_TOKEN, token);

      $log.debug('Access token saved:', token);
    }

    /**
     * Deletes a stored auth token.
     */
    function _removeAccessToken() {
      StorageService.removeValue(STORAGE_KEY.ACCESS_TOKEN);

      $log.debug('Access token removed.');
    }

    /**
     * Returns a stored auth token.
     * @return {string}
     */
    function getAccessToken() {
      return StorageService.getValue(STORAGE_KEY.ACCESS_TOKEN);
    }

    /**
     * Checks if an auth token has been saved.
     * @return {boolean}
     */
    function hasAccessToken() {
      return getAccessToken() !== null;
    }

    /**
     * Returns the refresh token from the given response or throws an error.
     * @param {object} response
     * @returns {string}
     */
    function _tryGetRefreshToken(response) {
      var token = _.get(response, 'data.refresh_token');

      if (!token) {
        throw new Error('Response does not contain a refresh token.');
      }

      return token;
    }

    /**
     * Stores a refresh token.
     * @param {string} token
     */
    function _saveRefreshToken(token) {
      StorageService.setValue(STORAGE_KEY.REFRESH_TOKEN, token);

      $log.debug('Refresh token saved:', token);
    }

    /**
     * Deletes a stored refresh token.
     */
    function _removeRefreshToken() {
      StorageService.removeValue(STORAGE_KEY.REFRESH_TOKEN);

      $log.debug('Refresh token removed.');
    }

    /**
     * Returns a stored refresh token.
     * @return {string}
     */
    function _getRefreshToken() {
      return StorageService.getValue(STORAGE_KEY.REFRESH_TOKEN);
    }

    /**
     * Checks if a refresh token has been saved.
     * @return {boolean}
     */
    function hasRefreshToken() {
      return _getRefreshToken() !== null;
    }

    return {
      login: login,
      authenticate: authenticate,
      ensureAuthenticated: ensureAuthenticated,
      logout: logout,
      getUser: getUser,
      getId: getId,
      isAuthenticated: isAuthenticated,
      getAccessToken: getAccessToken,
      hasAccessToken: hasAccessToken,
      hasRefreshToken: hasRefreshToken
    };
  });
