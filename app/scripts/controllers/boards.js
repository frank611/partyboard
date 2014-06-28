'use strict';

angular.module('pboardApp')
  .controller('BoardsCtrl', function ($scope, $http, Board, socket) {
    $scope.boards = Board.mine();
    $scope.joinableBoards = Board.joinable();

    socket.on('refreshJoinableBoards', function() {
      console.log("ALLO");
      $scope.joinableBoards = Board.joinable();
    });

    $scope.createBoard = function() {
      var newBoard = Board.create({
        name: $scope.newBoardName
      });

      $scope.newBoardName = "";

      $scope.boards.push(newBoard);
    };
  });
