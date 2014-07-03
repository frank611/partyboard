'use strict';

angular.module('pboardApp')

	.directive('bgImg', function(){
    return function(scope, element, attrs){
      attrs.$observe('bgImg', function(value) {
        element.css({
          'background-image': 'url(' + value +')'
        });
      });
    };
	});