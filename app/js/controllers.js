(function() {
  var ctrls;

  ctrls = angular.module('Controllers', []);

  ctrls.controller('baseCtrl', [
    '$scope', function($scope) {
      return $scope.test = 'Das ist ein Test';
    }
  ]);

}).call(this);
