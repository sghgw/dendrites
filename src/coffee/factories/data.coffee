fs = require 'fs'
path = require 'path'
module = angular.module 'dataFactory', []

module.factory 'Data', () ->
  {
    files: []
    groups: []
    filename_pattern: '<Gruppe>_<Titel>'
    grouping: false
    data_options:
      dendrite:
        length: true
        surface: false
        volume: false
        spine_number: true
        spine_density: true
        mean_spine_length: true
      spines:
        length: false
        diameter: false
        distance: false
        length_to_center: false

    # method to load a list of files of given dir
    loadFileList: (source) ->
      # filter filelist for file with extensions .xls or .xlsx
      if fs.existsSync source
        @source = source
        @files = _.filter fs.readdirSync(source), (file) ->
          _.contains ['.xls', '.xlsx'], path.extname(file)
        @destination = source + '/Auswertung.xlsx'

    groupFiles: ->
      console.log @filename_pattern
  }