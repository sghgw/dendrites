fs = require 'fs'
path = require 'path'
module = angular.module 'dataFactory', []

module.factory 'Data', () ->
  {
    files: []

    loadFileList: (source) ->
      # filter filelist for file with extensions .xls or .xlsx
      if fs.existsSync source
        @source = source
        @files = _.filter fs.readdirSync(source), (file) ->
          _.contains ['.xls', '.xlsx'], path.extname(file)
        @destination = source + '/Auswertung.xlsx'
  }