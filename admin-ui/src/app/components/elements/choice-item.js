angular.module('nnAdmin')

  // Controller that connects the necessary services to the choice item view.
  .controller('ChoiceItemCtrl', function($scope, $log, COLLAPSED_DEFAULT, itemService, slideService, choiceElementService, infoService, Languages) {
    $scope.collapsed = COLLAPSED_DEFAULT;
    $scope.itemService = itemService;
    $scope.infoService = infoService;
    $scope.service = choiceElementService;
    $scope.model = $scope.data.items[$scope.data.index];
    $scope.model.info = infoService.normalize($scope.model.info);
    $scope.languages = Languages;
    $scope.slideOptions = [];

    if (angular.isString($scope.model.label)) {
      var label = $scope.model.label;
      $scope.model.label = {fi: label};
    }

    slideService.getOptionsArray()
      .then(function(options) {
        $scope.slideOptions = options;
      });
  })

  // Directive that allows us to re-use the choice item element.
  .directive('nnChoiceItem', function() {
    return {
      restrict: 'A',
      controller: 'ChoiceItemCtrl',
      scope: {
        data: '=nnChoiceItem'
      },
      templateUrl: 'components/elements/choice-item.html'
    };
  });
