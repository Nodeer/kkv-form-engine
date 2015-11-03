'use strict';

angular.module('nnAdmin')

    // Service that handles all logic related to form elements.
    .service('FormElementService', function () {
        var itemTypeOptions = [
            {type: 'text', label: 'Text'},
            {type: 'autocomplete', label: 'Autocomplete'},
            {type: 'checkbox', label: 'Checkbox'},
            {type: 'dropdown', label: 'Drop-down'},
            {type: 'textarea', label: 'Text Area'}
        ];

        var inputTypeOptions = [
            {type: 'text', label: 'Text'},
            {type: 'email', label: 'E-mail'},
            {type: 'number', label: 'Number'},
            {type: 'url', label: 'URL'}
        ];

        /**
         *
         * @param {object} model
         * @returns {string}
         */
        function getLabel(model) {
            var label = 'Unknown';
            angular.forEach(itemTypeOptions, function (value, key) {
                if (value.type === model.type) {
                    label = value.label;
                }
            });
            return label;
        }

        /**
         *
         * @param {object} model
         * @returns {string}
         */
        function getName(model) {
            return model.name;
        }

        this.itemTypeOptions = itemTypeOptions;
        this.inputTypeOptions = inputTypeOptions;

        this.getLabel = getLabel;
        this.getName = getName;
    })

    // Controller that connects the necessary services to the form element view.
    .controller('FormElementCtrl', function ($scope, COLLAPSED_DEFAULT, ElementService, ItemService, StyleService, FormElementService) {
        $scope.collapsed = COLLAPSED_DEFAULT;
        $scope.adding = false;
        $scope.elementService = ElementService;
        $scope.itemService = ItemService;
        $scope.service = FormElementService;
        $scope.model = $scope.data.elements[$scope.data.index];
        $scope.model.items = ItemService.normalize($scope.model.items);
        $scope.model.style = StyleService.normalize($scope.model.style);

        function createItem(type) {
            ItemService.create($scope.model.items, type);
            $scope.adding = false;
        }

        $scope.createItem = createItem;
    })

    // Directive that allows us to re-use the form element.
    .directive('nnFormElement', function () {
        return {
            restrict: 'A',
            controller: 'FormElementCtrl',
            scope: {
                data: '=nnFormElement'
            },
            templateUrl: 'elements/form.html'
        };
    });
