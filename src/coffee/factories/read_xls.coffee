path = require 'path'
fs = require 'fs'

module = angular.module 'readXlsFactory', []

module.factory 'readXls', () ->
  {
    start: (dir, filename) ->
      file = @open dir, filename
      @load(file, filename)
    open: (dir, file) ->
      data = fs.readFileSync dir + '/' + file
      if path.extname(file) is '.xls'
        return XLS.read data 
      else 
        return XLSX.read data
    load: (file, filename) ->
      dendrite = {
        file: filename
        group: ''
        title: path.basename filename, '.xls', '.xlsx'
        length: file.Sheets['Each Tree-Dendrite']['D2'].v.toFixed(1)/1
        surface: file.Sheets['Each Tree-Dendrite']['G2'].v
        volume: file.Sheets['Each Tree-Dendrite']['J2'].v
        total_spines: file.Sheets['Each Tree-Dendrite']['R2'].v
        
        spines: []
      }
      dendrite.spine_density = (dendrite.total_spines / dendrite.length).toFixed(4)/1
      for i in [2..(dendrite.total_spines + 1)]
        spine = {
          length: file.Sheets['Spine Details']['E' + i].v
          diameter: file.Sheets['Spine Details']['F' + i].v
          distance: file.Sheets['Spine Details']['G' + i].v
          length_to_center: file.Sheets['Spine Details']['D' + i].v
        }
        dendrite.spines.push spine

      # calculate mean spine data...
      dendrite.spine_means = {
        length: (ss.mean _.map(dendrite.spines, (spine) -> spine.length)).toFixed(4)/1
        diameter: (ss.mean _.map(dendrite.spines, (spine) -> spine.diameter)).toFixed(4)/1
        distance: (ss.mean _.map(dendrite.spines, (spine) -> spine.distance)).toFixed(4)/1
        length_to_center: (ss.mean _.map(dendrite.spines, (spine) -> spine.length_to_center)).toFixed(4)/1
      }

      dendrite
  }