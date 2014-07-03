'use strict';

angular.module('pboardApp')
  .factory('Board', function ($resource) {
    var addContributorCount = function(boardJson) {
      var boards = angular.fromJson(boardJson);

      boards.forEach(function(board, index) {
        var contribs = [];

        board.posts.forEach(function(post) {
          if (contribs.indexOf(post.creator)) {
            contribs.push(post.creator);
          }
        });

        boards[index].nbContribs = contribs.length;
      });

      return boards;
    };

    return $resource('/api/boards/:id', {
      id: '@id'
    }, { //parameters default
      get: {
        method: 'GET'
      },
      mine: {
        method: 'GET',
        params: {
          id: 'mine'
        },
        isArray: true,
        transformResponse: addContributorCount
      },
      joinable: {
        method: 'GET',
        params: {
          id: 'joinable'
        },
        isArray: true,
        transformResponse: addContributorCount
      },
      create: {
        method: 'POST'
      },
      addPost: {
        method: 'PUT'
      }
	  });
  });
