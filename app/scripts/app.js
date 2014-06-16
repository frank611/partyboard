'use strict';

angular.module('pboardApp', [
  "ngCookies","ngResource","ngSanitize","ngRoute"
])
.config(function ($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/main',
      controller: 'MainCtrl'
    })
    .when('/boards', {
      templateUrl: 'partials/boards',
      controller: 'BoardsCtrl',
      authenticate: true
    })
    .when('/boards/:id', {
      templateUrl: 'partials/board-viewing',
      controller: 'BoardViewingCtrl',
      authenticate: true
    })
    .when('/boards/:id/post', {
      templateUrl: 'partials/post',
      controller: 'PostCtrl',
      authenticate: true
    })
    .otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);

  // Intercept 401s and redirect you to login
  $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
    return {
      'responseError': function(response) {
        if(response.status === 401) {
          $location.path('/login');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  }]);
})
.run(function ($rootScope, $location, Auth) {

  $rootScope.$on('$routeChangeStart', function (event, next) {
    // Redirect to login if route requires auth and you're not logged in
    if (next.authenticate && !Auth.isLoggedIn()) {
      console.log("auth deny");
      $location.path('/');
    }
  });
});