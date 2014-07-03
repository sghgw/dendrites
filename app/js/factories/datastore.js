(function() {
  var Datastore, module;

  Datastore = require('nedb');

  module = angular.module('dataStoreFactory', ['readXlsFactory', 'XlsxFactory']);

  module.factory('dataStore', function() {
    return {
      db: {},
      initDB: function() {
        if (_.isEmpty(this.db)) {
          return this.db.dendrites = new Datastore();
        }
      },
      getDB: function() {
        this.initDB();
        return this.db;
      },
      addDendrite: function(data) {
        this.initDB();
        return this.db.dendrites.insert({
          data: data
        });
      }
    };
  });

}).call(this);
