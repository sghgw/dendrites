(function() {
  var ctrls;

  ctrls = angular.module('Controllers', []);

  ctrls.controller('baseCtrl', [
    '$scope', function($scope) {
      var fs, path;
      fs = require('fs');
      path = require('path');
      $scope.files = [];
      return $scope.$watch('dir', function(newValue, oldValue) {
        if (newValue) {
          return $scope.files = _.filter(fs.readdirSync(newValue), function(file) {
            return _.contains(['.xls', '.xlsx'], path.extname(file));
          });
        }
      });
    }
  ]);

}).call(this);
