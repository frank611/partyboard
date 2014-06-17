'use strict';

angular.module('pboardApp')
	.filter('publicImageUrl', function() {
	  return function(postId) {
	    return '/api/posts/' + postId + '/image';
	  };
	});