'use strict';

angular.module('nnAdmin')

    // Controller that connects the necessary services to the choice item view.
    .controller('ChoiceItemCtrl', function ($scope, $log, COLLAPSED_DEFAULT, ItemService, SlideService, ChoiceElementService, InfoService) {
        $scope.collapsed = COLLAPSED_DEFAULT;
        $scope.itemService = ItemService;
        $scope.slideService = SlideService;
        $scope.infoService = InfoService;
        $scope.service = ChoiceElementService;
        $scope.model = $scope.data.items[$scope.data.index];
        $scope.model.info = InfoService.normalize($scope.model.info);
    })

    // Directive that allows us to re-use the choice item element.
    .directive('nnChoiceItem', function () {
        return {
            restrict: 'A',
            controller: 'ChoiceItemCtrl',
            scope: {
                data: '=nnChoiceItem'
            },
            templateUrl: 'elements/choice-item.html'
        };
    });
