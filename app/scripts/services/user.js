'use strict';

angular.module('pboardApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id', {
      id: '@id'
    }, { //parameters default
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });
