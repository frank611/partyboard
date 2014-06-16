'use strict';

angular.module('pboardApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
