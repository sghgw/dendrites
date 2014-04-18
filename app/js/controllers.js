(function() {
  var ctrls;

  ctrls = angular.module('Controllers', []);

  ctrls.controller('baseCtrl', [
    '$scope', function($scope) {
      var fs;
      fs = require('fs');
      $scope.files = [];
      return $scope.$watch('dir', function(newValue, oldValue) {
        $scope.files = newValue ? fs.readdirSync(newValue) : [];
        return console.log(newValue);
      });
    }
  ]);

}).call(this);
