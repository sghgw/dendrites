(function() {
  var Datastore, module;

  Datastore = require('nedb');

  module = angular.module('dataStoreFactory', ['readXlsFactory', 'XlsxFactory']);

  module.factory('dataStore', function() {
    return {
      db: {}
    };
  });

}).call(this);
