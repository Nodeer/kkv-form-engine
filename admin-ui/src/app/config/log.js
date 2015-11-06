angular.module('nnAdmin')
  .config(function($logProvider, DEBUG) {
    $logProvider.debugEnabled(DEBUG);
  });
