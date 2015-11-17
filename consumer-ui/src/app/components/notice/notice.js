'use strict';

angular.module('nettineuvoja')

    .directive('nnNotice', function () {
        return {
            restrict: 'A',
            scope: {
                model: '=nnNotice'
            },
            templateUrl: 'components/notice/notice.html'
        };
    });
