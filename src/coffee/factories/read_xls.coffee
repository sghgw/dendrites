module = angular.module 'readXlsFactory', []

module.factory 'readXls', () ->
  {
    xls: require 'xlsjs'
    xlsx: require 'xlsx'
    stats: require 'simple-statistics'
    path: require 'path'
    start: (dir, file) ->
      file = @open dir, file
      @load(file)
    open: (dir, file) ->
      if @path.extname(file) is '.xls' then @xls.readFile(dir + '/' + file) else @xlsx.readFile(dir + '/' + file)
    load: (file) ->
      dendrite = {
        length: file.Sheets['Each Tree-Dendrite']['D2'].v
        spines: 
          total: file.Sheets['Each Tree-Dendrite']['R2'].v
      }
      dendrite.spines.data = (file.Sheets['Spine Details']['E' + i].v for i in [2..(dendrite.spines.total + 1)])
      dendrite.spines.mean_length = @stats.mean(dendrite.spines.data)
      dendrite.spines.density = dendrite.spines.total / dendrite.length
      dendrite
  }