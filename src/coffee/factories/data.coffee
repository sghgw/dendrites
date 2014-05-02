fs = require 'fs'
path = require 'path'
module = angular.module 'dataFactory', ['readXlsFactory', 'XlsxFactory']

module.factory 'Data', ['readXls', 'Xlsx', (readXls, Xlsx) ->
  {
    files: []
    groups: []
    filename_pattern: '<Gruppe>_<Titel>'
    grouping: false
    loaded_data: false
    data_options:
      dendrite:
        length: true
        surface: false
        volume: false
        total_spines: true
        spine_density: true
        mean_spine_length: true
      spines:
        length: false
        diameter: false
        distance: false
        length_to_center: false
        grouped_length: false

    # method to load a list of files of given dir
    loadFileList: (source) ->
      # filter filelist for file with extensions .xls or .xlsx
      if fs.existsSync source
        @source = source
        files = _.filter fs.readdirSync(source), (file) ->
          _.contains ['.xls', '.xlsx'], path.extname(file)
        @files = _.map files, (filename) ->
          {name: filename, title: ''} 
        @destination = source + '/Auswertung.xlsx'
          
    # method to load dendrite data from excel file
    loadDendriteData: ->
      for file in @files
        file.dendrite = readXls.start @source, file.name, @data_options
      @loaded_data = true

    groupFiles: ->
      p = @checkPattern()
      groups = {} 
      if !p
        @groups = []
        return false

      for file in @files
        # file = file.split(path.extname(file))[0]
        groupname = if p.first is 'group' then file.name.split(p.pattern)[0] else file.name.split(p.pattern).slice(1).join(p.pattern).split(path.extname(file.name))[0]
        title = if p.first is 'title' then file.name.split(p.pattern)[0] else file.name.split(p.pattern).slice(1).join(p.pattern).split(path.extname(file.name))[0]
        file.title = title
        file.group = groupname

        if groups[groupname]
          groups[groupname] += 1
        else
          groups[groupname] = 1

      @groups = _.map groups, (number, id) ->
        {id: id, files: number}
      return true

    checkPattern: ->
      pattern = @filename_pattern.split('<Gruppe>')[1]
      if pattern
        if pattern is pattern.split('<Titel>')[0] or pattern.split('<Titel>')[0] is ''
          return false
        else
          first = 'group'
          pattern = pattern.split('<Titel>')[0]
      else if @filename_pattern.split('<Titel>')[1]
        pattern = @filename_pattern.split('<Titel>')[1]
        if pattern is pattern.split('<Gruppe>')[0] or pattern.split('<Gruppe>')[0] is ''
          return false
        else
          first = 'title'
          pattern = @filename_pattern.split('<Titel>')[1].split('<Gruppe>')[0]
      else
        return false

      {
        pattern: pattern
        first: first
      }

    exportData: ->
      @loadDendriteData() if !@loaded_data
      Xlsx.setDestination @destination
      # console.log Xlsx.buildRow @prepareTableHeader(), 1, true
      body = _.map @files, (file) =>
        @prepareDendriteData file
      console.log Xlsx.buildGrid @prepareTableHeader(), body, 1
      # for file, index in @files
      #   data = @prepareDendriteData(file)
      #   console.log Xlsx.buildRow(data, index + 2)

    prepareDendriteData: (file) ->
      data = []
      data.push file.title
      data.push file.dendrite.length if @data_options.dendrite.length
      data.push file.dendrite.surface if @data_options.dendrite.surface
      data.push file.dendrite.volume if @data_options.dendrite.volume
      data.push file.dendrite.total_spines if @data_options.dendrite.total_spines
      data.push file.dendrite.spine_density if @data_options.dendrite.spine_density
      data.push file.dendrite.mean_spine_length if @data_options.dendrite.mean_spine_length
      data

    prepareTableHeader: ->
      data = []
      data.push 'Dendrit'
      data.push 'Länge' if @data_options.dendrite.length
      data.push 'Oberfläche' if @data_options.dendrite.surface
      data.push 'Volumen' if @data_options.dendrite.volume
      data.push 'Spineanzahl' if @data_options.dendrite.total_spines
      data.push 'Spinedichte' if @data_options.dendrite.spine_density
      data.push 'Mittlere Spinelänge' if @data_options.dendrite.mean_spine_length
      data
  }]