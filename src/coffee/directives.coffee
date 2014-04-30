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

module.directive 'tabMenu', () ->
  {
    restrict: 'A'
    templateUrl: '../views/tab-menu.html'
    scope:
      items: '='
    link: ($scope, element, attrs) ->
      console.log 'Here I am.'

  }