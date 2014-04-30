(function() {
  var ctrls, fs, path;

  fs = require('fs');

  path = require('path');

  ctrls = angular.module('Controllers', []);

  ctrls.controller('baseCtrl', [
    '$scope', 'readXls', 'Xlsx', function($scope, readXls, Xlsx) {
      $scope.files = [];
      $scope.dendrites = [];
      $scope.$watch('dir', function(newValue, oldValue) {
        if (newValue) {
          return $scope.files = _.filter(fs.readdirSync(newValue), function(file) {
            return _.contains(['.xls', '.xlsx'], path.extname(file));
          });
        }
      });
      $scope.loadData = function() {
        angular.forEach($scope.files, function(file, index) {
          return $scope.dendrites.push(readXls.start($scope.dir, file));
        });
        return console.log($scope.dendrites);
      };
      return $scope.exportData = function() {
        return Xlsx.log();
      };
    }
  ]);

  ctrls.controller('sourceCtrl', [
    '$scope', 'Data', function($scope, Data) {
      $scope.data = Data;
      return $scope.$watch('dir', function(newValue, oldValue) {
        if (newValue) {
          return $scope.data.files = _.filter(fs.readdirSync(newValue), function(file) {
            return _.contains(['.xls', '.xlsx'], path.extname(file));
          });
        }
      });
    }
  ]);

  ctrls.controller('destinationCtrl', [
    '$scope', 'Data', function($scope, Data) {
      $scope.data = Data;
      return $scope.getFiles = function() {
        console.log($scope.$parent);
        return console.log($scope.data.files);
      };
    }
  ]);

}).call(this);
