ctrls = angular.module 'Controllers', []

ctrls.controller 'baseCtrl', ['$scope', ($scope) ->
  fs = require 'fs'
  $scope.files = []
  $scope.loadFiles = () ->
    $scope.files = fs.readdirSync $scope.dir
]