'use strict';

angular.module('pboardApp')
  .controller('PostCtrl', function ($scope, $routeParams, Board) {

    $scope.uploadPost = function(form) {
      var s3upload = new S3Upload({
        file_dom_selector: '#pictureInput',
        s3_sign_put_url: '/getS3Url',
        onProgress: function(percent, message) {
          console.log(percent, message);
        },
        onFinishS3Put: function(public_url) {
          console.log(public_url);
        },
        onError: function(status) {
          console.log(status);
        }
      });
    };

  });
