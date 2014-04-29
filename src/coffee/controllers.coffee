ctrls = angular.module 'Controllers', []

ctrls.controller 'baseCtrl', ['$scope', 'readXls', 'Xlsx', ($scope, readXls, Xlsx) ->
  fs = require 'fs'
  path = require 'path'
  $scope.files = []
  $scope.dendrites = []
  # update filelist if dir has changed
  $scope.$watch 'dir', (newValue, oldValue) ->
    if newValue
      # filter filelist for file with extensions .xls or .xlsx
      $scope.files = _.filter fs.readdirSync(newValue), (file) ->
        _.contains ['.xls', '.xlsx'], path.extname(file)
  $scope.loadData = () ->

    angular.forEach $scope.files, (file, index) ->
      $scope.dendrites.push readXls.start $scope.dir, file
    console.log $scope.dendrites

  $scope.exportData = () ->
    Xlsx.log()
]