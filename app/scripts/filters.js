'use strict';

angular.module('pboardApp')

	.filter('publicImageUrl', function() {
	  return function(post) {
	    return '/api/posts/' + post._id + '/image';
	  };
	})

	.filter('profilePicUrl', function() {
	  return function(user) {
	    return '/api/users/' + user._id + '/picture';
	  };
	});