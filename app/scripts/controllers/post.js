'use strict';

angular.module('pboardApp')
  .controller('PostCtrl', function ($scope, $routeParams, Board, S3) {
    $scope.tookPhoto = false;

    $scope.uploadPost = function() {
    	var file = $('#pictureInput')[0].files[0];

      $scope.resizeImage(file, function(resizedFile) {
        S3.uploadImage(resizedFile, function(s3Key) {
          Board.addPost({
            id: $routeParams.id
          }, {
            s3Key: s3Key,
            quote: $scope.quote
          });
        });
      });
    };

    $scope.openCamera = function() {
      $('#pictureInput').click();
    }

    // This is called when the user takes a picture (on input:file's change event)
    $scope.photoTaken = function(dataURI) {
      $scope.$apply(function() {
        $scope.localPhotoSrc = dataURI;
      });
    }

    $scope.resizeImage = function(file, cb) {
      function dataURItoBlob(dataURI) {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for(var i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
      }

      var img = document.createElement("img");
      var canvas = document.createElement("canvas");
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function(e) { img.src = e.target.result; };

      img.onload = function() {
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var MAX_WIDTH = 1920;
        var MAX_HEIGHT = 1080;
        var width = img.width;
        var height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        var dataurl = canvas.toDataURL("image/jpeg", 0.5);

        var resizedFile = dataURItoBlob(dataurl);
        resizedFile.name = file.name;
        cb(resizedFile);
      };
    };

  });
