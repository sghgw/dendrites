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
      pattern = @filename_pattern.split('<Gruppe>')[1]
      if pattern
        if pattern is pattern.split('<Titel>')[0] or pattern.split('<Titel>')[0] is ''
          return false
        else
          first = 'group'
          pattern = pattern.split('<Titel>')[0]
          console.log first, pattern
      else if @filename_pattern.split('<Titel>')[1]
        pattern = @filename_pattern.split('<Titel>')[1]
        if pattern is pattern.split('<Gruppe>')[0] or pattern.split('<Gruppe>')[0] is ''
          return false
        else
          first = 'title'
          pattern = @filename_pattern.split('<Titel>')[1].split('<Gruppe>')[0]
          console.log first, pattern
      else
        return false

      return true


  }