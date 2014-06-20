'use strict';

angular.module('pboardApp')
  .controller('BoardViewingCtrl', function ($scope, $routeParams, $interval, Board, $rootScope, socket, preloader, $filter) {

  	// Settings
  	$scope.slideshowSpeed = 3000;

  	$scope.newPosts = [];
  	$scope.slideshowIndex = 0;
  	$scope.isLoading = true;
  	$scope.board = Board.get({ id: $routeParams.id }, function() {
  		// Preload images then start slideshow
  		$scope.imageLocations = $scope.board.posts.map(function(post) {
  			return $filter('publicImageUrl')(post);
  		});

      preloader.preloadImages($scope.imageLocations);
      $scope.resumeNormalSlideshow();
  	});

	  socket.on('connect', function() {
	  	socket.emit('joinBoard', $routeParams.id);
	  });

	  socket.on('newPost', function(post) {
	  	console.log('newPost');
  		$scope.addNewPostToQueue(post);
  	});

  	$scope.addNewPostToQueue = function(post) {
  		preloader.preloadImages(['http://localhost:9000' + $filter('publicImageUrl')(post)]).then(function() {
  			$scope.newPosts.push(post);
	  		$interval.cancel($scope.slideshowInterval);

				function showNewPost() {
	  			if ($scope.newPosts.length > 0) {
	  				$scope.currentPost = $scope.newPosts.shift();
	  				$scope.board.posts.push($scope.currentPost);
	  			}
	  			else {
	  				$interval.cancel($scope.newQueueInterval);
	  				$scope.resumeNormalSlideshow();
	  			}
	  		}

	  		$scope.newQueueInterval = $interval(showNewPost, $scope.slideshowSpeed);
	  		showNewPost();
  		});
  	};

  	$scope.resumeNormalSlideshow = function() {
  		$scope.currentPost = $scope.board.posts[$scope.slideshowIndex];
  		$scope.isLoading = false;

  		$scope.slideshowInterval = $interval(function() {
  			$scope.currentPost = $scope.board.posts[$scope.slideshowIndex];

	  		if ($scope.slideshowIndex < $scope.board.posts.length - 1) {
	  			$scope.slideshowIndex++;
	  		}
	  		else {
	  			$scope.slideshowIndex = 0;
	  		}
	  	}, $scope.slideshowSpeed);
  	};
  });
