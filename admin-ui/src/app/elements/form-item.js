'use strict';

angular.module('nnAdmin')

    // Controller that connects the necessary services to the form item view.
    .controller('FormItemCtrl', function ($scope, COLLAPSED_DEFAULT, ItemService, SlideService, FormElementService, InfoService) {
        $scope.collapsed = COLLAPSED_DEFAULT;
        $scope.itemService = ItemService;
        $scope.infoService = InfoService;
        $scope.slideService = SlideService;
        $scope.service = FormElementService;
        $scope.model = $scope.data.items[$scope.data.index];
        $scope.model.notices = $scope.model.notices || {};
        $scope.model.info = InfoService.normalize($scope.model.info);
        $scope.model.items = ItemService.normalize($scope.model.items);
    })

    // Directive that allows us to re-use the form item element.
    .directive('nnFormItem', function () {
        return {
            restrict: 'A',
            controller: 'FormItemCtrl',
            scope: {
                data: '=nnFormItem'
            },
            templateUrl: 'elements/form-item.html'
        };
    });
