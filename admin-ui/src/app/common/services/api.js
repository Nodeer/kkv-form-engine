'use strict';

angular.module('nnAdmin')
  .service('ApiService', function($http, _, UtilityService, API_URL, API_VERSION, OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SECRET) {
    /**
     * Authenticates a user with the API.
     * @param {object} data
     * @returns {HttpPromise}
     */
    this.login = function(data) {
      return this.sendRequest({
        method: 'POST',
        url: createUrl('auth/login'),
        data: data,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
    };

    /**
     * Validates the session for the authenticated user.
     * @returns {HttpPromise}
     */
    this.validateToken = function() {
      return this.sendRequest({
        method: 'POST',
        url: createUrl('auth/validate')
      });
    };

    /**
     * Refreshes the session for the authenticated user.
     * @param {object} data
     * @returns {HttpPromise}
     */
    this.refreshToken = function(data) {
      return this.sendRequest({
        method: 'POST',
        url: this.getRefreshTokenUrl(),
        data: data,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
    };

    /**
     * Returns the profile for the logged in user.
     * @returns {HttpPromise}
     */
    this.getUser = function() {
      return this.sendRequest({
        url: createUrl('me')
      });
    };

    /**
     * Returns all slides from the API.
     * @returns {HttpPromise}
     */
    this.getSlides = function() {
      return this.sendRequest({
        url: createUrl('slides')
      });
    };

    /**
     * Creates a new slide through the API.
     * @param {object} slide
     * @returns {HttpPromise}
     */
    this.createSlide = function(slide) {
      return this.sendRequest({
        method: 'POST',
        url: createUrl('slides'),
        data: slide
      });
    };

    /**
     * Saves a slides through the API.
     * @param {string} id
     * @param {object} slide
     * @returns {HttpPromise}
     */
    this.saveSlide = function(id, slide) {
      return this.sendRequest({
        method: 'PUT',
        url: createUrl('slides/' + id),
        data: slide
      });
    };

    /**
     * Removes a slide through the API.
     * @param {string} id
     * @returns {HttpPromise}
     */
    this.removeSlide = function(id) {
      return this.sendRequest({
        method: 'DELETE',
        url: createUrl('slides/' + id)
      });
    };

    //this.saveSlideOrder = function (data) {
    //    return $http.post(createUrl('slides/update_order'), data);
    //};

    /**
     * Returns autocomplete data for the given source via the API.
     * @param {string} source
     * @returns {HttpPromise}
     */
    this.autocomplete = function(source) {
      return this.sendRequest({
        url: createUrl('autocomplete'),
        data: {source: source}
      });
    };

    /**
     * Returns the OAuth 2 client ID.
     * @return {string}
     */
    this.getOAuth2ClientId = function() {
      return OAUTH2_CLIENT_ID;
    };

    /**
     * Returns the OAuth 2 client secret.
     * @return {string}
     */
    this.getOAuth2ClientSecret = function() {
      return OAUTH2_CLIENT_SECRET;
    };

    /**
     * Returns the URL used for refreshing tokens.
     * @returns {string}
     */
    this.getRefreshTokenUrl = function() {
      return createUrl('auth/refresh');
    };

    this.sendRequest = function(config) {
      if (_.contains(config, 'url')) {
        throw new Error('Cannot send request without "url".');
      }

      config.method = (config.method || 'GET').toUpperCase();

      return $http(config);
    };

    /**
     * Creates an absolute API URL.
     * @param {string} path e.g. '/user/login'
     * @param {string} [version] e.g. 'v1' (defaults to API_VERSION)
     */
    function createUrl(path, version) {
      version = version || API_VERSION;
      return UtilityService.ensureTrailingSlash(API_URL) + version + UtilityService.ensureLeadingSlash(path);
    };
  });

