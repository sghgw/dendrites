module = angular.module 'dendritesDirectives', []

module.directive 'dir', () ->
  {
    restrict: 'A'
    scope:
      dir: '='
    link: ($scope, el, attrs) ->
      el.bind 'change', (event) ->
        files = event.target.files
        file = files[0]
        $scope[attrs.dir] = file.path
        $scope.$apply()
  }

module.directive 'tabList', () ->
  {
    restrict: 'E'
    transclude: true
    templateUrl: '../views/tabs.html'
    scope: {}
    controller: ($scope) ->
      $scope.items = []
      $scope.select = (item) ->
        angular.forEach $scope.items, (item) ->
          item.selected = false
        item.selected = true
      {
        addItem: (item) ->
          $scope.select(item) if $scope.items.length is 0
          $scope.items.push item
      }
  }

module.directive 'tabPane', () ->
  {
    require: '^tabList'
    restrict: 'E'
    transclude: true
    templateUrl: '../views/tab-pane.html'
    scope: 
      title: '@'
      icon: '@'
    link: (scope, element, attrs, tabsCtrl) ->
      tabsCtrl.addItem scope
  }

module.directive 'switch', ['$window', ($window) ->
  {  
    restrict: 'A'
    scope:
      switch: '='
    link: ($scope, element, attrs) ->
      init = new $window.Switchery(element[0])
      element.bind 'change', (event) ->
        console.log element[0].checked
        $scope.switch = element[0].checked
        $scope.$apply()
  }]
