Datastore = require 'nedb'

module = angular.module 'dataStoreFactory', ['readXlsFactory', 'XlsxFactory']

module.factory 'dataStore', () ->
  {
    db: {}
  }