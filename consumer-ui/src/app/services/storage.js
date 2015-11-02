'use strict';

angular.module('nettineuvoja')

    .service('StorageService', function ($q, localStorageService) {
        var defer = $q.defer();

        function getValue(key) {
            return localStorageService.get(key);
        }

        function setValue(key, value) {
            defer.notify(key);
            return localStorageService.set(key, value);
        }

        function removeValue(key) {
            defer.notify(key);
            return localStorageService.remove(key);
        }

        function observeStorage() {
            return defer.promise;
        }

        this.get = getValue;
        this.set = setValue;
        this.remove = removeValue;
        this.observeStorage = observeStorage;
    });
