'use strict';

angular.module('pboardApp')
  .controller('BoardViewingCtrl', function ($scope, $routeParams, $interval, Board, $rootScope, socket) {

  	$scope.newPosts = [];

	  socket.on('connect', function() {
	  	socket.emit('joinBoard', $routeParams.id);
	  });

	  socket.on('newPost', function(post) {
  		$scope.addNewPostToQueue(post);
  	});

  	$scope.addNewPostToQueue = function(post) {
  		$scope.newPosts.push(post);
  	}

  	$scope.isLoading = true;

  	$scope.board = Board.get({
  		id: $routeParams.id
  	}, function() {
  		var slideshowIndex = 0;
	  	$scope.currentPost = $scope.board.posts[slideshowIndex];
	  	$scope.isLoading = false;

	  	var slideshowInterval = $interval(function() {
	  		if (slideshowIndex < $scope.board.posts.length - 1) {
	  			slideshowIndex++;
	  		}
	  		else {
	  			slideshowIndex = 0;
	  		}

	  		$scope.currentPost = $scope.board.posts[slideshowIndex];
	  	}, 8000);
  	});
  });
