'use strict';

angular.module('nettineuvoja')
    .filter('html', function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        };
    });
