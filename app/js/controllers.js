(function() {
  var ctrls;

  ctrls = angular.module('Controllers', []);

  ctrls.controller('baseCtrl', [
    '$scope', 'readXls', function($scope, readXls) {
      var fs, path;
      fs = require('fs');
      path = require('path');
      $scope.files = [];
      $scope.$watch('dir', function(newValue, oldValue) {
        if (newValue) {
          return $scope.files = _.filter(fs.readdirSync(newValue), function(file) {
            return _.contains(['.xls', '.xlsx'], path.extname(file));
          });
        }
      });
      return $scope.loadData = function() {
        return readXls.start($scope.dir, $scope.files[0]);
      };
    }
  ]);

}).call(this);
