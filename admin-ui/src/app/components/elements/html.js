angular.module('nnAdmin')

    // Service that handles all logic related to html elements.
    .service('HtmlelementService', function () {
        this.tagOptions = [
            {name: 'div', label: 'Div'},
            {name: 'p', label: 'Paragraph'},
            {name: 'h2', label: 'Heading 2'},
            {name: 'h3', label: 'Heading 3'},
            {name: 'h4', label: 'Heading 4'},
            {name: 'h5', label: 'Heading 5'},
            {name: 'h6', label: 'Heading 6'}
        ];
    })

    // Controller that connects the necessary services to the html element.
    .controller('HtmlElementCtrl', function ($scope, COLLAPSED_DEFAULT, elementService, HtmlelementService) {
        $scope.collapsed = COLLAPSED_DEFAULT;
        $scope.elementService = elementService;
        $scope.service = HtmlelementService;
        $scope.model = $scope.data.elements[$scope.data.index];
        $scope.model.style = $scope.model.style || [];
    })

    // Directive that allows us to re-use the html element.
    .directive('nnHtmlElement', function () {
        return {
            restrict: 'A',
            controller: 'HtmlElementCtrl',
            scope: {
                data: '=nnHtmlElement'
            },
            templateUrl: 'components/elements/html.html'
        };
    });
