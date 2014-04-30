(function() {
  var ctrls;

  ctrls = angular.module('Controllers', []);

  ctrls.controller('baseCtrl', [
    '$scope', 'readXls', 'Xlsx', function($scope, readXls, Xlsx) {
      var fs, path;
      fs = require('fs');
      path = require('path');
      $scope.files = [];
      $scope.dendrites = [];
      $scope.menu_items = [];
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

}).call(this);
