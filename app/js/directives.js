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

  module.directive('tabList', function() {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: '../views/tabs.html',
      scope: {},
      controller: function($scope) {
        $scope.items = [];
        $scope.select = function(item) {
          angular.forEach($scope.items, function(item) {
            return item.selected = false;
          });
          return item.selected = true;
        };
        return {
          addItem: function(item) {
            if ($scope.items.length === 0) {
              $scope.select(item);
            }
            return $scope.items.push(item);
          }
        };
      }
    };
  });

  module.directive('tabPane', function() {
    return {
      require: '^tabList',
      restrict: 'E',
      transclude: true,
      templateUrl: '../views/tab-pane.html',
      scope: {
        title: '@',
        icon: '@'
      },
      link: function(scope, element, attrs, tabsCtrl) {
        return tabsCtrl.addItem(scope);
      }
    };
  });

}).call(this);
