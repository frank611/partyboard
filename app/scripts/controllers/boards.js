'use strict';

angular.module('pboardApp')
  .controller('BoardsCtrl', function ($scope, $http, Board, socket) {
  $scope.boards = Board.mine();
  $scope.joinableBoards = Board.joinable();

  socket.on('friendStartedShowingBoard', function(board) {
    console.log(board);
  })

  $scope.createBoard = function() {
    var newBoard = Board.create({
      name: $scope.newBoardName
    });

    $scope.boards.push(newBoard);
  };
  });
