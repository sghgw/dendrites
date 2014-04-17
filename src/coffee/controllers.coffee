ctrls = angular.module 'Controllers', []

ctrls.controller 'baseCtrl', ['$scope', ($scope) ->
  $scope.test = 'Das ist ein Test'
]