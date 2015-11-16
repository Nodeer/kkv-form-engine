angular.module('nnAdmin')

    .service('infoService', function ($modal) {
        function open(model) {
            $modal.open({
                size: 'lg',
                templateUrl: 'components/elements/info.html',
                controller: 'InfoCtrl',
                resolve: {
                    model: function () {
                        return model || {};
                    }
                }
            });
        }

        function normalize(model) {
            return angular.isDefined(model) && !angular.isArray(model) ? model : {};
        }

        this.open = open;
        this.normalize = normalize;
    })

    .controller('InfoCtrl', function ($scope, $modalInstance, model) {
        $scope.model = model;

        function close() {
            $modalInstance.dismiss('close');
        }

        $scope.close = close;
    });
