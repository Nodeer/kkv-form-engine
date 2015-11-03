'use strict';

angular.module('nnAdmin')

    // Service that handles all logic related to choice elements.
    .service('ChoiceElementService', function () {
        var iconOptions = [
            {url: 'images/icon-cart.png', label: 'Cart'},
            {url: 'images/icon-company.png', label: 'Company'},
            {url: 'images/icon-discount.png', label: 'Discount'},
            {url: 'images/icon-fault.png', label: 'Fault'},
            {url: 'images/icon-housing.png', label: 'Housing'},
            {url: 'images/icon-late.png', label: 'Late'},
            {url: 'images/icon-new-car.png', label: 'New car'},
            {url: 'images/icon-no.png', label: 'No'},
            {url: 'images/icon-person.png', label: 'Person'},
            {url: 'images/icon-phone-internet.png', label: 'Phone & Internet'},
            {url: 'images/icon-service-delay.png', label: 'Service delay'},
            {url: 'images/icon-service.png', label: 'Service'},
            {url: 'images/icon-tools.png', label: 'Tools'},
            {url: 'images/icon-travel.png', label: 'Travel'},
            {url: 'images/icon-truck.png', label: 'Truck'},
            {url: 'images/icon-used-car.png', label: 'Used car'},
            {url: 'images/icon-user.png', label: 'User'},
            {url: 'images/icon-yes.png', label: 'Yes'}
        ];

        function getLabel(model) {
            return model.label || 'Unlabeled choice';
        }

        function getName(model) {
            return model.name;
        }

        this.iconOptions = iconOptions;

        this.getLabel = getLabel;
        this.getName = getName;
    })

    // Controller that connects the necessary services to the choice element view.
    .controller('ChoiceElementCtrl', function ($scope, COLLAPSED_DEFAULT, ElementService, ItemService) {
        $scope.collapsed = COLLAPSED_DEFAULT;
        $scope.elementService = ElementService;
        $scope.itemService = ItemService;
        $scope.model = $scope.data.elements[$scope.data.index];
        $scope.model.items = $scope.model.items || [];
        $scope.model.style = $scope.model.style || [];
    })

    // Directive that allows us to re-use the choice element.
    .directive('nnChoiceElement', function () {
        return {
            restrict: 'A',
            controller: 'ChoiceElementCtrl',
            scope: {
                data: '=nnChoiceElement'
            },
            templateUrl: 'elements/choice.html'
        };
    });
