module = angular.module 'readXlsFactory', []

module.factory 'readXls', () ->
  {
    xls: require 'xlsjs'
    xlsx: require 'xlsx'
    stats: require 'simple-statistics'
    path: require 'path'
    start: (dir, file) ->
      @open dir, file
      @load()
    open: (dir, file) ->
      @file = if @path.extname(file) is '.xls' then @xls.readFile(dir + '/' + file) else @xlsx.readFile(dir + '/' + file)
      console.log @file.SheetNames
    load: () ->
      @dendrite = {
        length: @file.Sheets['Each Tree-Dendrite']['D2'].v
        total_spines: @file.Sheets['Each Tree-Dendrite']['R2'].v
      }
      @dendrite.spines = (@file.Sheets['Spine Details']['E' + i].v for i in [2..(@dendrite.total_spines + 1)])
      @dendrite.mean_spine_length = @stats.mean(@dendrite.spines)
      console.log @dendrite
  }