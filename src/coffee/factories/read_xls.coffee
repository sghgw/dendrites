module = angular.module 'readXlsFactory', []

module.factory 'readXls', () ->
  {
    xls: require 'xlsjs'
    xlsx: require 'xlsx'
    path: require 'path'
    open: (path, file) ->
      console.log @path.extname(file)
  }