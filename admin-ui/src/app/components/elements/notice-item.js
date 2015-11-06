'use strict';

angular.module('nnAdmin')

    .service('NoticeItemService', function () {
        function getLabel(model) {
            return model.title || 'Untitled notice';
        }

        function getName(model) {
            return model.keyword;
        }

        this.getLabel = getLabel;
        this.getName = getName;
    })

    // Controller that connects the necessary services to the notice item view.
    .controller('NoticeItemCtrl', function ($scope, $log, COLLAPSED_DEFAULT, NoticeItemService, ItemService) {
        $scope.collapsed = COLLAPSED_DEFAULT;
        $scope.itemService = ItemService;
        $scope.service = NoticeItemService;
        $scope.model = $scope.data.items[$scope.data.index] || {};
    })

    // Directive that allows us to re-use the notice item element.
    .directive('nnNoticeItem', function () {
        return {
            restrict: 'A',
            controller: 'NoticeItemCtrl',
            scope: {
                data: '=nnNoticeItem'
            },
            templateUrl: 'components/elements/notice-item.html'
        };
    });
