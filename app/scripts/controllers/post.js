'use strict';

angular.module('pboardApp')
  .controller('PostCtrl', function ($scope, $routeParams, Board, S3) {

    $scope.uploadPost = function() {
      S3.uploadImage(document.querySelector('#pictureInput').files[0]);
    };

  });
