'use strict';

angular
  .module('nnAdmin', [
    'ngRoute',
    'ngAnimate',

    'nnAdmin.constants',
    'nnAdmin.templates',

    'ui.bootstrap',
    'textAngular'
  ])

  .config(function ($locationProvider) {
    $locationProvider.html5Mode(true);
  })

  .config(function($logProvider, DEBUG) {
    $logProvider.debugEnabled(DEBUG);
  });
