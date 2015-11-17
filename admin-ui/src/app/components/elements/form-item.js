angular.module('nnAdmin')

  // Controller that connects the necessary services to the form item view.
  .controller('FormItemCtrl', function($scope, COLLAPSED_DEFAULT, itemService, slideService, formElementService, noticeItemService, infoService, Languages) {
    $scope.collapsed = COLLAPSED_DEFAULT;
    $scope.itemService = itemService;
    $scope.infoService = infoService;
    $scope.slideService = slideService;
    $scope.service = formElementService;
    $scope.model = $scope.data.items[$scope.data.index];
    $scope.model.notices = noticeItemService.normalize($scope.model.notices);
    $scope.model.info = infoService.normalize($scope.model.info);
    $scope.model.items = itemService.normalize($scope.model.items);
    $scope.languages = Languages;

    angular.forEach(['label', 'placeholder', 'empty'], function(prop) {
      if (angular.isString($scope.model[prop])) {
        var value = $scope.model[prop];
        $scope.model[prop] = {fi: value};
      }
    });
  })

  // Directive that allows us to re-use the form item element.
  .directive('nnFormItem', function() {
    return {
      restrict: 'A',
      controller: 'FormItemCtrl',
      scope: {
        data: '=nnFormItem'
      },
      templateUrl: 'components/elements/form-item.html'
    };
  });
