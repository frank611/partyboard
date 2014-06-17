'use strict';

angular.module('pboardApp')
  .controller('BoardViewingCtrl', function ($scope, $routeParams, Board) {
  	$scope.board = Board.get({
  		id: $routeParams.id
  	});
  });
