fs = require 'fs'
path = require 'path'
gui = require 'nw.gui'

ctrls = angular.module 'Controllers', []

# ctrls.controller 'baseCtrl', ['$scope', 'readXls', 'Xlsx', ($scope, readXls, Xlsx) ->
#   $scope.files = []
#   $scope.dendrites = []
#   # update filelist if dir has changed
#   $scope.$watch 'dir', (newValue, oldValue) ->
#     if newValue
#       # filter filelist for file with extensions .xls or .xlsx
#       $scope.files = _.filter fs.readdirSync(newValue), (file) ->
#         _.contains ['.xls', '.xlsx'], path.extname(file)
#   $scope.loadData = () ->

#     angular.forEach $scope.files, (file, index) ->
#       $scope.dendrites.push readXls.start $scope.dir, file
#     console.log $scope.dendrites

#   $scope.exportData = () ->
#     Xlsx.log()
# ]

ctrls.controller 'sourceCtrl', ['$scope', 'Data', ($scope, Data) ->
  $scope.data = Data
  # set dir to /Users/sascha/Desktop/test for testing while dev
  $scope.dir = '/Users/sascha/Desktop/test'
  # update filelist if dir has changed
  $scope.$watch 'dir', (newValue, oldValue) ->
    Data.loadFileList(newValue) if newValue
    # also update groups
    $scope.data.groupFiles()
]

ctrls.controller 'groupsCtrl', ['$scope', 'Data', ($scope, Data) ->
  $scope.data = Data
  $scope.sort = 'id'
  $scope.reverse = false
  # method to sort table
  $scope.changeSort = (value, $event) ->
    if value is $scope.sort then $scope.reverse = !$scope.reverse else $scope.reverse = false
    # show arrow icon for sorted column and direction
    angular.element('#group_table th a i').hide()
    sortClass = if $scope.reverse then 'glyphicon-chevron-up' else 'glyphicon-chevron-down'
    angular.element($event.target).find('i').removeClass('glyphicon-chevron-up glyphicon-chevron-down').addClass(sortClass).show()
    $scope.sort = value

  $scope.$watch 'data.filename_pattern', (pattern, old) ->
    checkGroups $scope.data.grouping, true
  $scope.$watch 'data.grouping', (grouping, old) ->
    checkGroups grouping, false

  checkGroups = (val, show_success) ->
    angular.element('#pattern_div').removeClass('has-error')
    if val
      val = $scope.data.groupFiles() 
      if !val
        angular.element('#pattern_div').addClass('has-error')
      else
        angular.element('#pattern_div').addClass('has-success') if show_success
]

ctrls.controller 'dataCtrl', ['$scope', 'Data', ($scope, Data) ->
  $scope.data = Data
]

ctrls.controller 'previewCtrl', ['$scope', 'Data', ($scope, Data) ->
  $scope.data = Data
]

ctrls.controller 'destinationCtrl', ['$scope', 'Data', ($scope, Data) ->
  $scope.data = Data
  $scope.$watch 'dir', (newValue, oldValue) ->
    $scope.data.destination = newValue
]