angular.module('nnAdmin')

  // Controller that connects the necessary services to the next element view.
  .controller('NextElementCtrl', function($scope, COLLAPSED_DEFAULT, elementService, slideService) {
    $scope.collapsed = COLLAPSED_DEFAULT;
    $scope.elementService = elementService;
    $scope.model = $scope.data.elements[$scope.data.index];
    $scope.model.style = $scope.model.style || [];
    $scope.isSticky = true;
    $scope.slideOptions = [];

    slideService.getOptionsArray()
      .then(function(options) {
        $scope.slideOptions = options;
      });
  })

  // Directive that allows us to re-use the next element.
  .directive('nnNextElement', function() {
    return {
      restrict: 'A',
      controller: 'NextElementCtrl',
      scope: {
        data: '=nnNextElement'
      },
      templateUrl: 'components/elements/next.html'
    };
  });
