fs = require 'fs'
path = require 'path'
module = angular.module 'dataFactory', ['readXlsFactory', 'XlsxFactory', 'dataStoreFactory']

module.factory 'Data', ['readXls', 'Xlsx', 'dataStore', (readXls, Xlsx, dataStore) ->
  {
    dendrites: []
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
      # filter filelist for files with extensions .xls or .xlsx
      if fs.existsSync source
        @source = source
        files = _.filter fs.readdirSync(source), (file) ->
          _.contains ['.xls', '.xlsx'], path.extname(file)
        # call method to load data from files
        @loadDendriteData(files)
        
        @destination = source + '/Auswertung.xlsx'
          
    # method to load dendrite data from excel file
    loadDendriteData: (files) ->
      for file in files
        # read data from excel file
        data = readXls.start(@source, file)
        # write data to temporary db
        dataStore.addDendrite data
      # get all dendrite data for app
      @getDendriteData()

    getDendriteData: () ->
      dataStore.getDendrites().then (dendrites) =>
        @dendrites = dendrites

    getGroups: ->
      p = @checkPattern()
      return false if !p
      groups = _.countBy @dendrites, (dendrite) ->
        group = if p.first is 'group' then dendrite.file.split(p.pattern)[0] else dendrite.file.split(p.pattern).slice(1).join(p.pattern).split(path.extname(dendrite.file))[0]
        title = if p.first is 'title' then dendrite.file.split(p.pattern)[0] else dendrite.file.split(p.pattern).slice(1).join(p.pattern).split(path.extname(dendrite.file))[0]
        dataStore.updateDendrite dendrite._id, {title: title, group: group}
        group
      @getDendriteData()
      @groups = _.map _.pairs(groups), (group) ->
        {id: group[0], dendrites: group[1], title: ''}

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
      if @grouping
        @addTablesForGroups()
      else
        @addTableFor @files, 'Alle Daten'
      Xlsx.generateXlsxFile()


    addTableFor: (files, title, rowToStart) ->
      rowToStart = 1 if !rowToStart
      body = _.map files, (file) =>
        @prepareDendriteData file
      Xlsx.addGridWithTitle title, @prepareTableHeader(), body, rowToStart, "\u00dcbersicht"

    addTablesForGroups: ->
      header = @prepareTableHeader()
      row = 1
      for group, index in @groups
        title = if group.title then group.title else group.id
        files = _.where @files, {group: group.id}
        @addTableFor files, title, row
        row += files.length + 5


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
      data.push '#'
      data.push 'Dendrit'
      data.push 'L\u00e4nge' if @data_options.dendrite.length
      data.push 'Oberfl\u00e4che' if @data_options.dendrite.surface
      data.push 'Volumen' if @data_options.dendrite.volume
      data.push 'Spineanzahl' if @data_options.dendrite.total_spines
      data.push 'Spinedichte' if @data_options.dendrite.spine_density
      data.push 'Mittlere Spinel\u00e4nge' if @data_options.dendrite.mean_spine_length
      data
  }]