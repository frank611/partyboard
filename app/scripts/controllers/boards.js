'use strict';

angular.module('pboardApp')
  .controller('BoardsCtrl', function ($scope, $http, Board, socket, $location) {
    $scope.boards = Board.mine();
    $scope.joinableBoards = Board.joinable();

    socket.on('refreshJoinableBoards', function() {
      $scope.joinableBoards = Board.joinable();
    });

    $scope.createBoard = function() {
      var newBoard = Board.create({
        name: $scope.newBoardName
      });

      $scope.newBoardName = '';

      $scope.boards.push(newBoard);
    };

    // Allows us to link from ng-click
    $scope.goToBoard = function(board) {
      $location.path('/boards/' + board._id + '/post');
    };

    $scope.downloadBoard = function(boardId) {
      $http.get('/api/boards/' + boardId + '/download', function(res) {
        console.log(res);
      });
    };
  });
