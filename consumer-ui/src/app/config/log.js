angular.module('nettineuvoja')
  .config(function($logProvider, DEBUG) {
    $logProvider.debugEnabled(DEBUG);
  });
