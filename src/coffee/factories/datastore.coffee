Datastore = require 'nedb'

module = angular.module 'dataStoreFactory', ['readXlsFactory', 'XlsxFactory']

module.factory 'dataStore', () ->
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
      @db.dendrites.insert {data}
  }