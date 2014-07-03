'use strict';

angular.module('pboardApp')
  .controller('NavbarCtrl', function ($scope, Auth, $location) {

    $scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/');
      });
    };

  });
