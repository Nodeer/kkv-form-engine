'use strict';

angular.module('nnAdmin')

    // Controller that connects the necessary services to the next element view.
    .controller('NextElementCtrl', function ($scope, COLLAPSED_DEFAULT, ElementService, SlideService) {
        $scope.collapsed = COLLAPSED_DEFAULT;
        $scope.elementService = ElementService;
        $scope.slideService = SlideService;
        $scope.model = $scope.data.elements[$scope.data.index];
        $scope.model.style = $scope.model.style || [];
        $scope.isSticky = true;
    })

    // Directive that allows us to re-use the next element.
    .directive('nnNextElement', function () {
        return {
            restrict: 'A',
            controller: 'NextElementCtrl',
            scope: {
                data: '=nnNextElement'
            },
            templateUrl: 'elements/next.html'
        };
    });
