'use strict';

angular.module('nettineuvoja')

    .service('SummaryService', function () {

        function calculateDemandTotal(model) {
            if (!model) {
                return 0;
            }
            var total = 0;
            angular.forEach(['postikulut', 'matkakulut', 'puhelinkulut', 'muut_kulut'], function (value) {
                if (model[value]) {
                    total += parseInt(model[value]);
                }
            });
            return total;
        }

        this.calculateDemandTotal = calculateDemandTotal;
    })

    .controller('SummaryCtrl', function ($log, $scope, SummaryService, slideService, StorageService) {
        function buildSummaryData(model) {
            var slide,
                summaryData = [],
                element,
                items;

            angular.forEach(model, function (value, key) {
                slide = SlideService.get(key);

                if (Number(slide.exclude_from_summary) === 0) {
                    items = [];
                    angular.forEach(value, function (elementValue, elementKey) {
                        element = SlideService.getElement(key, elementKey);
                        switch (element.type) {
                            case 'choice':
                                angular.forEach(element.items, function (item) {
                                    if ((angular.isString(elementValue) && item.name == elementValue) || elementValue[item.name]) {
                                        items.push(item.label);
                                    }
                                });
                                break;
                            case 'form':
                                angular.forEach(element.items, function (item) {
                                    if (elementValue[item.name]) {
                                        switch (item.type) {
                                            case 'checkbox':
                                                items.push(item.label);
                                                break;
                                            case 'dropdown':
                                                angular.forEach(item.items, function (dropdownItem) {
                                                    if (dropdownItem.name == elementValue[item.name]) {
                                                        items.push(item.label + ': ' + dropdownItem.label);
                                                    }
                                                });
                                                break;
                                            default:
                                                var text = '';

                                                if (item.label) {
                                                    text += item.label + ': ';
                                                }

                                                text += elementValue[item.name];

                                                items.push(text);

                                        }

                                    }
                                });
                                break;
                        }
                    });

                    summaryData.push({
                        label: slide.summary_label ? slide.summary_label : slide.label,
                        items: items
                    });
                }
            });

            $log.debug('Summary data built', summaryData);
            $scope.summaryData = summaryData;
        }

        buildSummaryData($scope.model);
        StorageService.observeStorage().then(null, null, function (key) {
            if (key == 'nnSession') {
                buildSummaryData(StorageService.get('nnSession').model);
            }
        });
        $scope.service = SummaryService;
        $scope.slideService = SlideService;
    })

    .directive('nnSummary', function () {
        return {
            restrict: 'A',
            controller: 'SummaryCtrl',
            scope: {
                model: '=nnSummary'
            },
            templateUrl: 'components/summary/summary.html'
        };
    });
