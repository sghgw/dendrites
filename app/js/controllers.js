(function() {
  var ctrls, fs, gui, path;

  fs = require('fs');

  path = require('path');

  gui = require('nw.gui');

  ctrls = angular.module('Controllers', []);

  ctrls.controller('sourceCtrl', [
    '$scope', 'Data', function($scope, Data) {
      $scope.data = Data;
      return $scope.$watch('dir', function(newValue, oldValue) {
        if (newValue) {
          return Data.loadFileList(newValue);
        }
      });
    }
  ]);

  ctrls.controller('dataCtrl', [
    '$scope', 'Data', function($scope, Data) {
      $scope.data = Data;
      $scope.check = true;
      $scope.app = gui.App;
      return console.log($scope.app.dataPath);
    }
  ]);

  ctrls.controller('previewCtrl', [
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
