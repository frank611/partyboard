'use strict';

angular.module('pboardApp')
  .controller('MainCtrl', function ($scope, $location, $http, Auth) {
  	if (Auth.isLoggedIn()) { $location.path('/boards'); }
  });
