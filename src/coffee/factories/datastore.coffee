Datastore = require 'nedb'

module = angular.module 'dataStoreFactory', ['readXlsFactory', 'XlsxFactory']

module.factory 'dataStore', () ->
  {
    db: {}

    # load databases
    initDB: () ->
      @db.dendrites = new Datastore()
      # @db.presets = new Datastore(filename: '', autoload: true)

    getDB: () ->
      @initDB() if !@db 
      return @db
  }