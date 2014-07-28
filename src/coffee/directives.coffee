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
      init.setPosition true if $scope.switch
      element.bind 'change', (event) ->
        $scope.switch = element[0].checked
        $scope.$apply()
  }]

module.directive 'tooltip', () ->
  {
    restrict: 'A'
    scope: 
      tooltip: '@'
    link: (scope, element, attrs) ->
      tooltip = 'top' if !tooltip
      element.tooltip {placement: tooltip, container: 'body'}
  }

module.directive 'slider', () ->
  {
    restrict: 'EA'
    replace: true
    template: '<input type="text" />'
    scope:
      range: '='
      width: '='
    link: (scope, el, attrs) ->
      # console.log scope
      # console.log element.slider()
      el.slider {
        min: 0
        max: 10
        step: 0.1
        range: true
        value: scope.range
      }
      el.bind 'slideStop', () ->
        console.log el.slider('getValue')
        scope.range = el.slider('getValue')
        scope.$apply()
  }
