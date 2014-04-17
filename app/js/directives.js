(function() {
  var module;

  module = angular.module('dendritesDirectives', []);

  module.directive('dir', function() {
    return {
      restrict: 'A',
      scope: {
        dir: '='
      },
      link: function($scope, el, attrs) {
        return el.bind('change', function(event) {
          var file, files;
          files = event.target.files;
          file = files[0];
          $scope[attrs.dir] = file.path;
          return $scope.$apply();
        });
      }
    };
  });

}).call(this);
