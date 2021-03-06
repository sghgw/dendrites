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

  ctrls.controller('groupsCtrl', [
    '$scope', 'Data', function($scope, Data) {
      var checkGroups;
      $scope.data = Data;
      $scope.sort = 'id';
      $scope.reverse = false;
      $scope.changeSort = function(value, $event) {
        var sortClass;
        if (value === $scope.sort) {
          $scope.reverse = !$scope.reverse;
        } else {
          $scope.reverse = false;
        }
        angular.element('#group_table th a i').hide();
        sortClass = $scope.reverse ? 'glyphicon-chevron-up' : 'glyphicon-chevron-down';
        angular.element($event.target).find('i').removeClass('glyphicon-chevron-up glyphicon-chevron-down').addClass(sortClass).show();
        return $scope.sort = value;
      };
      $scope.$watch('data.filename_pattern', function(pattern, old) {
        return checkGroups($scope.data.grouping, true);
      });
      $scope.$watch('data.grouping', function(grouping, old) {
        return checkGroups(grouping, false);
      });
      $scope.$watch('data.filename_delimiter', function(delimiter, old) {
        return checkGroups($scope.data.grouping, true);
      });
      return checkGroups = function(val, show_success) {
        angular.element('#pattern_div').removeClass('has-error');
        if (val) {
          val = $scope.data.getGroups();
          if (!val) {
            return angular.element('#pattern_div').addClass('has-error');
          } else {
            if (show_success) {
              return angular.element('#pattern_div').addClass('has-success');
            }
          }
        }
      };
    }
  ]);

  ctrls.controller('dataCtrl', [
    '$scope', 'Data', function($scope, Data) {
      $scope.data = Data;
      return $scope.$watch('data.data_options', (function(val, old) {
        return $scope.data.loaded_data = false;
      }), true);
    }
  ]);

  ctrls.controller('previewCtrl', [
    '$scope', 'Data', function($scope, Data) {
      $scope.data = Data;
      return $scope.loadDendriteData = function() {
        return $scope.data.loadDendriteData();
      };
    }
  ]);

  ctrls.controller('exportCtrl', [
    '$scope', 'Data', function($scope, Data) {
      $scope.data = Data;
      $scope.$watch('dir', function(newValue, oldValue) {
        return $scope.data.destination = newValue;
      });
      return $scope.exportData = function() {
        return $scope.data.exportData();
      };
    }
  ]);

  ctrls.controller('spinesGroupsCtrl', [
    '$scope', 'Data', function($scope, Data) {
      $scope.data = Data;
      $scope.groups = Data.data_options.spines.groups;
      $scope.add = function() {
        return $scope.groups.push({
          name: 'Gruppe ' + ($scope.groups.length + 1),
          range: [0, 10]
        });
      };
      return $scope["delete"] = function(index) {
        return $scope.groups.splice(index, 1);
      };
    }
  ]);

}).call(this);
