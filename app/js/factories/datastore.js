(function() {
  var Datastore, module;

  Datastore = require('nedb');

  module = angular.module('dataStoreFactory', ['readXlsFactory', 'XlsxFactory']);

  module.factory('dataStore', function() {
    return {
      db: {},
      initDB: function() {
        return this.db.dendrites = new Datastore();
      },
      getDB: function() {
        if (!this.db) {
          this.initDB();
        }
        return this.db;
      }
    };
  });

}).call(this);
