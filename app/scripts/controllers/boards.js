'use strict';

angular.module('pboardApp')
  .controller('BoardsCtrl', function ($scope, $http, Board) {
    $scope.boards = Board.mine();
  });
