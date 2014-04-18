ctrls = angular.module 'Controllers', []

ctrls.controller 'baseCtrl', ['$scope', ($scope) ->
  fs = require 'fs'
  $scope.files = []
  $scope.$watch 'dir', (newValue, oldValue) ->
    $scope.files = if newValue then fs.readdirSync(newValue) else []
    console.log newValue
]