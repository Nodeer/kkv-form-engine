angular.module('nnAdmin')
  .constant('StorageNamespace', 'nnAdmin')
  .service('storageService', function($log, localStorageService) {
    this.hasValue = function(key) {
      return !!localStorageService.get(key);
    };

    this.getValue = function(key) {
      return localStorageService.get(key);
    };

    this.setValue = function(key, value) {
      localStorageService.set(key, value);
    };

    this.removeValue = function(key) {
      localStorageService.remove(key);
    };
  });
