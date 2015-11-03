'use strict';

angular.module('nnAdmin')

    // Directive that allows us to re-use the item header element.
    .directive('nnItemHeader', function () {
        return {
            templateUrl: 'elements/item-header.html',
            transclude: true,
            link: function (scope, element) {
                element.addClass('panel-heading');
            }
        };
    });
