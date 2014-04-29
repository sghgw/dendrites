(function() {
  var module;

  module = angular.module('XlsxFactory', []);

  module.factory('Xlsx', function() {
    return {
      zip: new require('jszip'),
      log: function() {
        return console.log(this.zip);
      }
    };
  });

}).call(this);
