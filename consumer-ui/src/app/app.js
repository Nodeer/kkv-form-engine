'use strict';

angular.module('nettineuvoja', [
    'ngRoute',
    'ngAnimate',
    'nettineuvoja.constants',
    'nettineuvoja.templates',
    'nord.resource-service',
    'lodash',
    'ui.bootstrap',
    'duScroll',
    'LocalStorageModule'
  ])

  .value('duScrollGreedy', true);
