'use strict';

angular.module('nnAdmin')
    
    // Services that handles all logic related to the preview modal.
    .service('PreviewService', function ($modal) {
        function open(model) {
            $modal.open({
                size: 'lg',
                templateUrl: 'components/edit/preview.html',
                controller: 'PreviewCtrl',
                resolve: {
                    model: function () {
                        return model;
                    }
                }
            });
        }

        this.open = open;
    })

    // Controller that connects the necessary services to to the preview modal.
    .controller('PreviewCtrl', function ($scope, $modalInstance, model) {
        $scope.model = model;

        /**
         * Closes the modal.
         */
        function close() {
            $modalInstance.dismiss('close');
        }

        $scope.close = close;
    });
