ctrls = angular.module 'Controllers', []

ctrls.controller 'baseCtrl', ['$scope', 'readXls', ($scope, readXls) ->
  fs = require 'fs'
  path = require 'path'
  $scope.files = []
  # update filelist if dir has changed
  $scope.$watch 'dir', (newValue, oldValue) ->
    if newValue
      # filter filelist for file with extensions .xls or .xlsx
      $scope.files = _.filter fs.readdirSync(newValue), (file) ->
        _.contains ['.xls', '.xlsx'], path.extname(file)
  $scope.loadData = () ->
    readXls.open $scope.dir, $scope.files[0]
]