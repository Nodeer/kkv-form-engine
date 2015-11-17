angular.module('nettineuvoja')
  .service('storageService', function($q, localStorageService) {
    var dfd = $q.defer();

    function getValue(key) {
      return localStorageService.get(key);
    }

    function setValue(key, value) {
      dfd.notify(key);
      return localStorageService.set(key, value);
    }

    function removeValue(key) {
      dfd.notify(key);
      return localStorageService.remove(key);
    }

    function observeStorage() {
      return dfd.promise;
    }

    this.get = getValue;
    this.set = setValue;
    this.remove = removeValue;
    this.observeStorage = observeStorage;
  });
