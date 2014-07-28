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

  module.directive('switch', [
    '$window', function($window) {
      return {
        restrict: 'A',
        scope: {
          "switch": '='
        },
        link: function($scope, element, attrs) {
          var init;
          init = new $window.Switchery(element[0]);
          if ($scope["switch"]) {
            init.setPosition(true);
          }
          return element.bind('change', function(event) {
            $scope["switch"] = element[0].checked;
            return $scope.$apply();
          });
        }
      };
    }
  ]);

  module.directive('tooltip', function() {
    return {
      restrict: 'A',
      scope: {
        tooltip: '@'
      },
      link: function(scope, element, attrs) {
        var tooltip;
        if (!tooltip) {
          tooltip = 'top';
        }
        return element.tooltip({
          placement: tooltip,
          container: 'body'
        });
      }
    };
  });

  module.directive('slider', function() {
    return {
      restrict: 'EA',
      replace: true,
      template: '<input type="text" />',
      scope: {
        range: '=',
        width: '='
      },
      link: function(scope, el, attrs) {
        el.slider({
          min: 0,
          max: 10,
          step: 0.1,
          range: true,
          value: scope.range
        });
        return el.bind('slideStop', function() {
          console.log(el.slider('getValue'));
          scope.range = el.slider('getValue');
          return scope.$apply();
        });
      }
    };
  });

}).call(this);
