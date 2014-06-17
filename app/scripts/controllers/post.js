'use strict';

angular.module('pboardApp')
  .controller('PostCtrl', function ($scope, $routeParams, Board, S3) {

    $scope.uploadPost = function() {
    	var file = document.querySelector('#pictureInput').files[0];
      S3.uploadImage(file, function(s3url) {
      	Board.addPost({
      		id: $routeParams.id
      	}, {
      		s3url: s3url,
      		quote: $scope.quote
      	});
      });
    };

  });
