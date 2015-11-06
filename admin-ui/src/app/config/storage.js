angular.module('nnAdmin')
  .config(function(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('kkvAdmin');
  });
