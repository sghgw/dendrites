Datastore = require 'nedb'

module = angular.module 'dataStoreFactory', []

module.factory 'dataStore', ($q) ->
  {
    db: {}

    # load databases
    initDB: () ->
      if _.isEmpty(@db)
        @db.dendrites = new Datastore()
        # @db.presets = new Datastore(filename: '', autoload: true)

    getDB: () ->
      @initDB()
      return @db

    addDendrite: (data) ->
      @initDB()
      @db.dendrites.insert data

    getDendrites: ->
      d = $q.defer()
      @db.dendrites.find {}, (err, docs) =>
        d.resolve docs
      return d.promise

    updateDendrite: (id, data) ->
      @db.dendrites.update {_id: id}, {$set: data}
  }