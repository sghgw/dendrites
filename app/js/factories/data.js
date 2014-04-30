(function() {
  var module;

  module = angular.module('dataFactory', []);

  module.factory('Data', function() {
    return {
      files: []
    };
  });

}).call(this);
