(function() {
  var Datastore, module;

  Datastore = require('nedb');

  module = angular.module('dataStoreFactory', []);

  module.factory('dataStore', function($q) {
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
        return this.db.dendrites.insert(data);
      },
      getDendrites: function() {
        var d,
          _this = this;
        d = $q.defer();
        this.db.dendrites.find({}, function(err, docs) {
          return d.resolve(docs);
        });
        return d.promise;
      },
      updateDendrite: function(id, data) {
        return this.db.dendrites.update({
          _id: id
        }, {
          $set: data
        });
      }
    };
  });

}).call(this);
