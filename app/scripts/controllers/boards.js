'use strict';

angular.module('pboardApp')
  .controller('BoardsCtrl', function ($scope, $location, $http, Board) {
  	$scope.boards = Board.mine();
  });
