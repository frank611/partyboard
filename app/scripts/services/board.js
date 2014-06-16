'use strict';

angular.module('pboardApp')
  .factory('Board', function ($resource) {
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
        isArray: true
      },
      create: {
        method: 'POST'
      },
      addPost: {
        method: 'PUT'
      }
	  });
  });
