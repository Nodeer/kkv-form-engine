angular.module('nnAdmin')

  // Service that handles all logic related to html elements.
  .service('htmlElementService', function() {
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
  .controller('HtmlElementCtrl', function($scope, COLLAPSED_DEFAULT, elementService, htmlElementService, Languages) {
    $scope.collapsed = COLLAPSED_DEFAULT;
    $scope.elementService = elementService;
    $scope.service = htmlElementService;
    $scope.model = $scope.data.elements[$scope.data.index];
    $scope.model.style = $scope.model.style || [];
    $scope.languages = Languages;

    if (angular.isString($scope.model.content)) {
      var content = $scope.model.content;
      $scope.model.content = {fi: content};
    }
  })

  // Directive that allows us to re-use the html element.
  .directive('nnHtmlElement', function() {
    return {
      restrict: 'A',
      controller: 'HtmlElementCtrl',
      scope: {
        data: '=nnHtmlElement'
      },
      templateUrl: 'components/elements/html.html'
    };
  });
