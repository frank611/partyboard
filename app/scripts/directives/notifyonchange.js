'use strict';

angular.module('pboardApp')
  .directive('notifyOnChange', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, $element, attrs) {
        $element.change(function() {
          var reader = new FileReader();
          reader.onload = function (e) {
            scope.photoTaken(e.target.result);
          }
          reader.readAsDataURL($element[0].files[0]);
        });
      }
    };
  });
