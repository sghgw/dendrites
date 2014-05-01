(function() {
  var fs, module, path;

  fs = require('fs');

  path = require('path');

  module = angular.module('dataFactory', []);

  module.factory('Data', function() {
    return {
      files: [],
      groups: [],
      filename_pattern: '<Gruppe>_<Titel>',
      grouping: false,
      data_options: {
        dendrite: {
          length: true,
          surface: false,
          volume: false,
          spine_number: true,
          spine_density: true,
          mean_spine_length: true
        },
        spines: {
          length: false,
          diameter: false,
          distance: false,
          length_to_center: false
        }
      },
      loadFileList: function(source) {
        if (fs.existsSync(source)) {
          this.source = source;
          this.files = _.filter(fs.readdirSync(source), function(file) {
            return _.contains(['.xls', '.xlsx'], path.extname(file));
          });
          return this.destination = source + '/Auswertung.xlsx';
        }
      },
      groupFiles: function() {
        return console.log(this.filename_pattern);
      }
    };
  });

}).call(this);
