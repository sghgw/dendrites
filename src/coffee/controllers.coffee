fs = require 'fs'
path = require 'path'

ctrls = angular.module 'Controllers', []

ctrls.controller 'baseCtrl', ['$scope', 'readXls', 'Xlsx', ($scope, readXls, Xlsx) ->
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

ctrls.controller 'sourceCtrl', ['$scope', 'Data', ($scope, Data) ->
  $scope.data = Data
  # update filelist if dir has changed
  $scope.$watch 'dir', (newValue, oldValue) ->
    if newValue
      # filter filelist for file with extensions .xls or .xlsx
      $scope.data.files = _.filter fs.readdirSync(newValue), (file) ->
        _.contains ['.xls', '.xlsx'], path.extname(file)
]

ctrls.controller 'dataCtrl', ['$scope', 'Data', ($scope, Data) ->
  $scope.data = Data
]

ctrls.controller 'destinationCtrl', ['$scope', 'Data', ($scope, Data) ->
  $scope.data = Data
]