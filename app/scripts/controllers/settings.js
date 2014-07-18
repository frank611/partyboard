'use strict';

angular.module('pboardApp')
  .controller('SettingsCtrl', function ($scope, $http, Board, socket, $location) {
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
    $scope.goToBoard = function (board) {
      $location.path('/boards/' + board._id + '/post');
    };
  });
