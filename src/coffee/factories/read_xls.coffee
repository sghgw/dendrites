module = angular.module 'readXlsFactory', []

module.factory 'readXls', () ->
  {
    xls: require 'xlsjs'
    xlsx: require 'xlsx'
    stats: require 'simple-statistics'
    path: require 'path'
    start: (dir, file, options) ->
      file = @open dir, file
      @load(file, options)
    open: (dir, file) ->
      if @path.extname(file) is '.xls' then @xls.readFile(dir + '/' + file) else @xlsx.readFile(dir + '/' + file)
    load: (file, options) ->
      dendrite = { spines: {}}
      dendrite.length = file.Sheets['Each Tree-Dendrite']['D2'].v.toFixed(1)/1 if options.dendrite.length
      dendrite.surface = file.Sheets['Each Tree-Dendrite']['G2'].v if options.dendrite.surface
      dendrite.volume = file.Sheets['Each Tree-Dendrite']['J2'].v if options.dendrite.volume
      dendrite.total_spines = file.Sheets['Each Tree-Dendrite']['R2'].v if options.dendrite.total_spines
      dendrite.spines.length = (file.Sheets['Spine Details']['E' + i].v for i in [2..(dendrite.total_spines + 1)]) if options.spines.length or options.dendrite.mean_spine_length or options.spines.grouped_length
      dendrite.spines.diameter = (file.Sheets['Spine Details']['F' + i].v for i in [2..(dendrite.total_spines + 1)]) if options.spines.diameter
      dendrite.spines.distance = (file.Sheets['Spine Details']['G' + i].v for i in [2..(dendrite.total_spines + 1)]) if options.spines.distance
      dendrite.spines.length_to_center = (file.Sheets['Spine Details']['D' + i].v for i in [2..(dendrite.total_spines + 1)]) if options.spines.length_to_center
      dendrite.mean_spine_length = @stats.mean(dendrite.spines.length).toFixed(4)/1 if options.dendrite.mean_spine_length
      dendrite.spine_density = (dendrite.total_spines / dendrite.length).toFixed(4)/1 if options.dendrite.spine_density
      if options.spines.grouped_length
        dendrite.spines.grouped_length = _.countBy dendrite.spines.length, (spine) ->
          return '< 0,5' if spine < 0.5
          return '0,5 - 1' if 0.5 <= spine < 1
          return '1 - 1,5' if 1 <= spine < 1.5
          return '1,5 - 2' if 1.5 <= spine < 2
          '> 2' if spine > 2

      dendrite
  }