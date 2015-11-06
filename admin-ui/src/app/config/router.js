angular.module('nnAdmin')
  .config(function($locationProvider, $urlRouterProvider, $sceDelegateProvider) {
    $locationProvider.html5Mode(true);
    $sceDelegateProvider.resourceUrlWhitelist(['self']);
    $urlRouterProvider.otherwise('/');
  })
  .run(function($log, $rootScope, $state, $location, _, AuthService) {
    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
      if (AuthService.isAuthenticated() && toState.hideWhenAuthenticated) {
        event.preventDefault();

        $log.debug('Redirecting to index...');

        $state.go('edit');
      }
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error, AuthError) {
      var status = _.get(error, 'status');

      event.preventDefault();

      $log.debug('State change error:', error.message);

      if (status === 404) {
        $state.go('not-found', {}, {location: false});
      }

      if (status === 403) {
        $state.go('access-denied', {}, {location: false});
      }

      if (_.contains(AuthError, error)) {
        $log.debug('Authentication required. Redirecting to login...');

        $state.go('login');
      }
    });
  });
