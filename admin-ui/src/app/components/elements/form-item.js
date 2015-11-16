angular.module('nnAdmin')

    // Controller that connects the necessary services to the form item view.
    .controller('FormItemCtrl', function ($scope, COLLAPSED_DEFAULT, itemService, slideService, FormelementService, infoService) {
        $scope.collapsed = COLLAPSED_DEFAULT;
        $scope.itemService = itemService;
        $scope.infoService = infoService;
        $scope.slideService = slideService;
        $scope.service = FormelementService;
        $scope.model = $scope.data.items[$scope.data.index];
        $scope.model.notices = $scope.model.notices || {};
        $scope.model.info = infoService.normalize($scope.model.info);
        $scope.model.items = itemService.normalize($scope.model.items);
    })

    // Directive that allows us to re-use the form item element.
    .directive('nnFormItem', function () {
        return {
            restrict: 'A',
            controller: 'FormItemCtrl',
            scope: {
                data: '=nnFormItem'
            },
            templateUrl: 'components/elements/form-item.html'
        };
    });
