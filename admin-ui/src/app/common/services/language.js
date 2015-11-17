angular.module('nnAdmin')
  .factory('languageService', function($q, apiService) {
    var _languages = [];

    /**
     * @returns {array}
     */
    function getLanguages() {
      var dfd = $q.defer();

      if (!_languages.length) {
        apiService.getLanguages()
          .then(function(response) {
            _languages = response.data;
            dfd.resolve(_languages);
          })
      } else {
        dfd.resolve(_languages);
      }

      return dfd.promise;
    }

    return {
      getLanguages: getLanguages
    };
  });
