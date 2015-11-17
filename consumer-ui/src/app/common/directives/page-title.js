angular.module('nettineuvoja')
  .directive('kkvPageTitle', function($log, APP_NAME) {
    return {
      restrict: 'A',
      require: '^title',
      template: '{{ pageTitle }}',
      controller: function($scope) {
        $scope.pageTitle = APP_NAME;
      }
    }
  });
