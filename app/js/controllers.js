(function() {
  var ctrls;

  ctrls = angular.module('Controllers', []);

  ctrls.controller('baseCtrl', [
    '$scope', function($scope) {
      var fs;
      fs = require('fs');
      $scope.files = [];
      return $scope.loadFiles = function() {
        return $scope.files = fs.readdirSync($scope.dir);
      };
    }
  ]);

}).call(this);
