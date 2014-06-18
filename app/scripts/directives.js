'use strict';

angular.module('pboardApp')
	.directive('resizeImage', function() {
	  return {
	  	restrict: 'A',
	    link: function($scope, $element, $attributes) {
	    	var image = $element;
	    	var $window = $(window);

	    	image.bind('load', function() {
	    		// Check if the image's size ratio is far from the screen's
	    		if (Math.abs(image.width() / image.height() - $window.width() / $window.height()) > 0.5) {
	    			if ((image.width() / image.height()) > ($window.width() / $window.height())) {
		    			image.removeClass('portrait');
		    			image.addClass('landscape');
		    			console.log('landscape');

		    			image.css('top', $window.height() / 2 - image.height() / 2).css('left', 0);
		    		}
		    		else {
		    			image.removeClass('landscape');
		    			image.addClass('portrait');
		    			console.log('portrait');

		    			image.css('left', $window.width() / 2 - image.width() / 2).css('top', 0);
		    		}
	    		}
	    	});
	    }
	  }
	})

	.directive('bgImg', function(){
    return function(scope, element, attrs){
      attrs.$observe('bgImg', function(value) {
        element.css({
          'background-image': 'url(' + value +')'
        });
      });
    };
	});