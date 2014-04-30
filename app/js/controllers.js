(function() {
  var ctrls, fs, path;

  fs = require('fs');

  path = require('path');

  ctrls = angular.module('Controllers', []);

  ctrls.controller('sourceCtrl', [
    '$scope', 'Data', function($scope, Data) {
      $scope.data = Data;
      return $scope.$watch('dir', function(newValue, oldValue) {
        if (newValue) {
          if (fs.existsSync(newValue)) {
            $scope.data.files = _.filter(fs.readdirSync(newValue), function(file) {
              return _.contains(['.xls', '.xlsx'], path.extname(file));
            });
            return $scope.data.destination = newValue + '/Auswertung.xlsx';
          }
        }
      });
    }
  ]);

  ctrls.controller('dataCtrl', [
    '$scope', 'Data', function($scope, Data) {
      return $scope.data = Data;
    }
  ]);

  ctrls.controller('destinationCtrl', [
    '$scope', 'Data', function($scope, Data) {
      $scope.data = Data;
      return $scope.$watch('dir', function(newValue, oldValue) {
        return $scope.data.destination = newValue;
      });
    }
  ]);

}).call(this);
