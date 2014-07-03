'use strict';

angular.module('pboardApp')
  .factory('S3', function ($http, $upload) {

    var getUploadUrl = function(file, cb) {
      $http.get('/api/s3Policy?mimeType=' + file.type).success(function(s3Params) {
        cb(s3Params);
      });
    }

    return {
      uploadImage: function(file, cb) {
        getUploadUrl(file, function(s3Params) {
          var s3Key = 'boardPics/' + Math.round(Math.random()*1000000) + '$' + file.name.replace(' ', '-');

          $upload.upload({
            url: 'https://partyboard.s3.amazonaws.com/',
            method: 'POST',
            data: {
              'key' : s3Key,
              'acl' : 'public-read',
              'Content-Type' : file.type,
              'AWSAccessKeyId': s3Params.AWSAccessKeyId,
              'success_action_status' : '201',
              'Policy' : s3Params.s3Policy,
              'Signature' : s3Params.s3Signature
            },
            file: file
          }).then(function(response) {
            cb(s3Key);
          });
        });
      }
    }
  });