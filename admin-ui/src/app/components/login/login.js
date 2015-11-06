angular.module('nnAdmin')
  .config(function($stateProvider) {
    $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'components/login/login.html',
      controller: 'LoginCtrl',
      hideWhenAuthenticated: true,
      resolve: {
        authenticate: function(AuthService) {
          return AuthService.authenticate();
        }
      }
    });

    $stateProvider.state('logout', {
      url: '/logout',
      controller: function($scope, $state, AuthService) {
        AuthService.logout();

        $state.go('login');
      }
    });
  })
  .controller('LoginCtrl', function($scope, $state, _, AuthService, ValidateService) {
    $scope.validateService = ValidateService;

    /**
     * Logs in.
     */
    $scope.login = function() {
      $scope.loading = true;

      AuthService.login($scope.email, $scope.password)
        .then(function() {
          $state.go('edit');
        })
        .finally(function() {
          $scope.loading = false;
        });
    };

    /**
     * Checks if the login form can be submitted.
     * @return {boolean}
     */
    $scope.canSubmit = function() {
      return $scope.loginForm.$dirty && $scope.loginForm.$valid;
    };
  });
