(function() {
  var fs, module, path;

  fs = require('fs');

  path = require('path');

  module = angular.module('dataFactory', []);

  module.factory('Data', function() {
    return {
      files: [],
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
      }
    };
  });

}).call(this);
