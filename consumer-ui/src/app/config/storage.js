angular.module('nettineuvoja')
  .config(function(localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('kkvConsumer')
      .setStorageType('sessionStorage');
  });
