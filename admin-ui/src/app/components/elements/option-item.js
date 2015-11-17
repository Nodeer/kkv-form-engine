angular.module('nnAdmin')

  .service('optionItemService', function() {
    function getLabel(model) {
      return 'Option';
    }

    function getName(model) {
      return model.name;
    }

    this.getLabel = getLabel;
    this.getName = getName;
  })

  // Controller that connects the necessary services to the option item view.
  .controller('OptionItemCtrl', function($scope, $log, COLLAPSED_DEFAULT, optionItemService, itemService, Languages) {
    $scope.collapsed = COLLAPSED_DEFAULT;
    $scope.itemService = itemService;
    $scope.service = optionItemService;
    $scope.model = $scope.data.items[$scope.data.index] || {};
    $scope.languages = Languages;

    if (angular.isString($scope.model.label)) {
      var label = $scope.model.label;
      $scope.model.label = {fi: label};
    }
  })

  // Directive that allows us to re-use the option item element.
  .directive('nnOptionItem', function() {
    return {
      restrict: 'A',
      controller: 'OptionItemCtrl',
      scope: {
        data: '=nnOptionItem'
      },
      templateUrl: 'components/elements/option-item.html'
    };
  });
