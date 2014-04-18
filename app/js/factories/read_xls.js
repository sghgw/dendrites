(function() {
  var module;

  module = angular.module('readXlsFactory', []);

  module.factory('readXls', function() {
    return {
      xls: require('xlsjs'),
      xlsx: require('xlsx'),
      path: require('path'),
      open: function(path, file) {
        return console.log(this.path.extname(file));
      }
    };
  });

}).call(this);
