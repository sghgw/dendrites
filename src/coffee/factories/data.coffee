fs = require 'fs'
path = require 'path'
module = angular.module 'dataFactory', ['readXlsFactory', 'XlsxFactory', 'dataStoreFactory']

module.factory 'Data', ['readXls', 'Xlsx', 'dataStore', (readXls, Xlsx, dataStore) ->
  {
    dendrites: []
    groups: []
    filename_pattern: '<Gruppe>_<Titel>'
    filename_delimiter_presets: [
      {name: 'Unterstrich', delimiter: '_'}
      {name: 'Bindestrich', delimiter: '-'}
    ]
    filename_delimiter: '_'
    grouping: false
    loaded_data: false
    data_options:
      dendrite:
        length: true
        surface: false
        volume: false
        total_spines: true
        spine_density: true
        spine_means:
          length: true
          diameter: false
          distance: false
          length_to_center: false
      spines:
        length: true
        diameter: false
        distance: false
        length_to_center: false
        grouped_length: false
        groups: []

    # method to load a list of files of given dir
    loadFileList: (source) ->
      # filter filelist for files with extensions .xls or .xlsx
      if fs.existsSync source
        @source = source
        files = _.filter fs.readdirSync(source), (file) ->
          _.contains ['.xls', '.xlsx'], path.extname(file)
        # call method to load data from files
        @loadDendriteData(files)
        
        # @destination = source + '/Auswertung.xlsx'
          
    # method to load dendrite data from excel file
    loadDendriteData: (files) ->
      # clear dendrites table
      dataStore.clearDendritesTable()
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
      groups = _.countBy @dendrites, (dendrite) =>
        parts = dendrite.file.split('.xls')[0].split @filename_delimiter
        title = _.map(p.title, (i) ->
          parts[i]
        ).join @filename_delimiter
        group = _.map(p.group, (i) ->
          parts[i]
        ).join @filename_delimiter

        dataStore.updateDendrite dendrite._id, {title: title, group: group}
        group
      @getDendriteData()
      @groups = _.map _.pairs(groups), (group) ->
        {id: group[0], dendrites: group[1], title: ''}

    checkPattern: ->
      parts = @filename_pattern.split @filename_delimiter
      group = []
      title = []
      for p, i in parts
        group.push(i) if p is '<Gruppe>'
        title.push(i) if p is '<Titel>'
      {
        group: group
        title: title
      }

    exportData: ->
      Xlsx.setTemplate('template2')
      if @grouping
        @addTablesForGroups()
      else
        @addTableFor @dendrites, 'Alle Daten'
      Xlsx.generateXlsxFile(@destination)


    addTableFor: (dendrites, title) ->
      # Should there be spine data exported?
      exportSpines = _.contains(_.values(@data_options.spines), true)
      groupSpines = if @data_options.spines.grouped_length and @data_options.spines.groups.length > 0 then true else false
      spines = []
      # add title for dendrites table
      Xlsx.addToSheet 'Dendriten', [[title]]
      # add title for spines table
      Xlsx.addToSheet 'Spines', [[title]] if exportSpines

      # get dendrite data and add it to excel file
      dendritesData = [@prepareDendriteHeader()]
      spinesData = [@prepareSpinesHeader()] if exportSpines

      for dendrite, index in dendrites
        dendritesData.push @prepareDendriteData dendrite, index + 1
        spinesData = spinesData.concat @prepareSpinesData(dendrite.spines, dendrite.title, spinesData.length - 1) if exportSpines
        spines = spines.concat dendrite.spines if groupSpines
      spinesData = @prepareGroupedSpinesData(spinesData, spines) if groupSpines
      Xlsx.addToSheet 'Dendriten', dendritesData, false
      Xlsx.addToSheet 'Spines', spinesData

    addTablesForGroups: ->
      for group, index in @groups
        title = if group.title then group.title else group.id
        dendrites = _.where @dendrites, {group: group.id}
        @addTableFor dendrites, title


    prepareDendriteData: (dendrite, index) ->
      data = []
      data.push index if index
      data.push dendrite.title
      data.push dendrite.length if @data_options.dendrite.length
      data.push dendrite.surface if @data_options.dendrite.surface
      data.push dendrite.volume if @data_options.dendrite.volume
      data.push dendrite.total_spines if @data_options.dendrite.total_spines
      data.push dendrite.spine_density if @data_options.dendrite.spine_density
      data.push dendrite.spine_means.length if @data_options.dendrite.spine_means.length
      data.push dendrite.spine_means.diameter if @data_options.dendrite.spine_means.diameter
      data.push dendrite.spine_means.distance if @data_options.dendrite.spine_means.distance
      data.push dendrite.spine_means.length_to_center if @data_options.dendrite.spine_means.length_to_center
      data

    prepareDendriteHeader: ->
      data = []
      data.push '#'
      data.push 'Dendrit'
      data.push 'L\u00e4nge' if @data_options.dendrite.length
      data.push 'Oberfl\u00e4che' if @data_options.dendrite.surface
      data.push 'Volumen' if @data_options.dendrite.volume
      data.push 'Spineanzahl' if @data_options.dendrite.total_spines
      data.push 'Spinedichte' if @data_options.dendrite.spine_density
      data.push 'Mittlere Spinel\u00e4nge' if @data_options.dendrite.spine_means.length
      data.push 'Mittler Spinedurchmesser' if @data_options.dendrite.spine_means.diameter
      data.push 'Mittlere Spinedistanz' if @data_options.dendrite.spine_means.distance
      data.push 'Mittlere Spinel\u00e4nge zum Zentrum' if @data_options.dendrite.spine_means.length_to_center
      data

    prepareSpinesHeader: ->
      data = []
      data.push '#'
      data.push 'Dendrit'
      data.push 'L\u00e4nge' if @data_options.spines.length
      data.push 'Durchmesser' if @data_options.spines.diameter
      data.push 'Distanz' if @data_options.spines.distance
      data.push 'L\u00e4nge zur Mitte' if @data_options.spines.length_to_center
      data

    prepareSpinesData: (spines, dendrite, index) ->
      _.map spines, (spine, n) =>
        data = []
        data.push index + n + 1
        data.push dendrite if dendrite
        data.push spine.length if @data_options.spines.length
        data.push spine.diameter if @data_options.spines.diameter
        data.push spine.distance if @data_options.spines.distance
        data.push spine.length_to_center if @data_options.spines.length_to_center
        data

    prepareGroupedSpinesData: (table, spines) ->
      groups = [['Gruppe', 'Untere Grenze', 'Obere Grenze', 'Spines, absolut', 'Spines, relativ']]
      for group in @data_options.spines.groups
        row = [group.name, group.range[0], group.range[1], 0]
        for spine in spines
          row[row.length - 1]++ if spine.length >= group.range[0] and spine.length < group.range[1]
        row.push (row[row.length - 1] / spines.length)
        groups.push row
      for item, index in groups
        table[index] = table[index].concat(['',''].concat(item))
      table
  }]