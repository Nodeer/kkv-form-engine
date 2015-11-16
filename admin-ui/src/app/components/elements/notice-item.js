angular.module('nnAdmin')

    .service('NoticeitemService', function () {
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
    .controller('NoticeItemCtrl', function ($scope, $log, COLLAPSED_DEFAULT, NoticeitemService, itemService) {
        $scope.collapsed = COLLAPSED_DEFAULT;
        $scope.itemService = itemService;
        $scope.service = NoticeitemService;
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
