'use strict';

angular.module('nettineuvoja', [
    'lodash',
    'ngRoute',
    'ngAnimate',
    'nettineuvoja.constants',
    'nettineuvoja.templates',
    'nord.resource-service',
    'ui.bootstrap',
    'pascalprecht.translate',
    'duScroll',
    'LocalStorageModule'
  ])
  .value('duScrollGreedy', true);
