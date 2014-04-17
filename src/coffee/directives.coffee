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