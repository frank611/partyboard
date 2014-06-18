'use strict';

angular.module('pboardApp')
  .controller('BoardsCtrl', function ($scope, $http, Board) {
    $scope.boards = Board.mine();

    $scope.createBoard = function() {
    	var newBoard = Board.create({
    		name: $scope.newBoardName
    	});

    	$scope.boards.push(newBoard);
    };
  });
