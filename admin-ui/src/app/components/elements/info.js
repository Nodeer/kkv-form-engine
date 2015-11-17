angular.module('nnAdmin')

  .service('infoService', function($modal) {
    function open(model) {
      $modal.open({
        size: 'lg',
        templateUrl: 'components/elements/info.html',
        controller: 'InfoCtrl',
        resolve: {
          model: function() {
            return model || {};
          }
        }
      });
    }

    function normalize(model) {
      return angular.isDefined(model) && !angular.isArray(model) ? model : {};
    }

    this.open = open;
    this.normalize = normalize;
  })

  .controller('InfoCtrl', function($scope, $modalInstance, model, languageService) {
    $scope.model = model;
    $scope.languages = [];

    /**
     * @returns {Promise}
     */
    function loadLanguages() {
      return languageService.getLanguages()
        .then(function(languages) {
          $scope.languages = languages;
        });
    }

    $scope.close = function() {
      $modalInstance.dismiss('close');
    };

    angular.forEach(['title', 'content'], function(prop) {
      if (angular.isString($scope.model[prop])) {
        var value = $scope.model[prop];
        $scope.model[prop] = {fi: value};
      }
    });

    loadLanguages();
  });
