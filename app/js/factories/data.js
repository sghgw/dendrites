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
        var first, pattern;
        console.log(this.filename_pattern);
        pattern = this.filename_pattern.split('<Gruppe>')[1];
        if (pattern) {
          if (pattern === pattern.split('<Titel>')[0] || pattern.split('<Titel>')[0] === '') {
            return false;
          } else {
            first = 'group';
            pattern = pattern.split('<Titel>')[0];
            console.log(first, pattern);
          }
        } else if (this.filename_pattern.split('<Titel>')[1]) {
          pattern = this.filename_pattern.split('<Titel>')[1];
          if (pattern === pattern.split('<Gruppe>')[0] || pattern.split('<Gruppe>')[0] === '') {
            return false;
          } else {
            first = 'title';
            pattern = this.filename_pattern.split('<Titel>')[1].split('<Gruppe>')[0];
            console.log(first, pattern);
          }
        } else {
          return false;
        }
        return true;
      }
    };
  });

}).call(this);
