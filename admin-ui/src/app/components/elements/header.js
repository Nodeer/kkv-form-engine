angular.module('nnAdmin')

    // Directive that allows us to re-use the element header element.
    .directive('nnElementHeader', function () {
        return {
            templateUrl: 'components/elements/header.html',
            transclude: true,
            link: function (scope, element) {
                element.addClass('panel-heading');
            }
        };
    });
