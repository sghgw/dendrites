(function() {
  var fs, module, path;

  fs = require('fs');

  path = require('path');

  module = angular.module('dataFactory', ['readXlsFactory']);

  module.factory('Data', [
    'readXls', function(readXls) {
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
            total_spines: true,
            spine_density: true,
            mean_spine_length: true
          },
          spines: {
            length: false,
            diameter: false,
            distance: false,
            length_to_center: false,
            grouped_length: false
          }
        },
        loadFileList: function(source) {
          var files;
          if (fs.existsSync(source)) {
            this.source = source;
            files = _.filter(fs.readdirSync(source), function(file) {
              return _.contains(['.xls', '.xlsx'], path.extname(file));
            });
            this.files = _.map(files, function(filename) {
              return {
                name: filename,
                title: ''
              };
            });
            return this.destination = source + '/Auswertung.xlsx';
          }
        },
        loadDendriteData: function() {
          var file, _i, _len, _ref, _results;
          _ref = this.files;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            file = _ref[_i];
            file.dendrite = readXls.start(this.source, file.name, this.data_options);
            _results.push(console.log(file.dendrite));
          }
          return _results;
        },
        groupFiles: function() {
          var file, groupname, groups, p, title, _i, _len, _ref;
          p = this.checkPattern();
          groups = {};
          if (!p) {
            this.groups = [];
            return false;
          }
          _ref = this.files;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            file = _ref[_i];
            groupname = p.first === 'group' ? file.name.split(p.pattern)[0] : file.name.split(p.pattern).slice(1).join(p.pattern).split(path.extname(file.name))[0];
            title = p.first === 'title' ? file.name.split(p.pattern)[0] : file.name.split(p.pattern).slice(1).join(p.pattern).split(path.extname(file.name))[0];
            file.title = title;
            file.group = groupname;
            if (groups[groupname]) {
              groups[groupname] += 1;
            } else {
              groups[groupname] = 1;
            }
          }
          this.groups = _.map(groups, function(number, id) {
            return {
              id: id,
              files: number
            };
          });
          return true;
        },
        checkPattern: function() {
          var first, pattern;
          pattern = this.filename_pattern.split('<Gruppe>')[1];
          if (pattern) {
            if (pattern === pattern.split('<Titel>')[0] || pattern.split('<Titel>')[0] === '') {
              return false;
            } else {
              first = 'group';
              pattern = pattern.split('<Titel>')[0];
            }
          } else if (this.filename_pattern.split('<Titel>')[1]) {
            pattern = this.filename_pattern.split('<Titel>')[1];
            if (pattern === pattern.split('<Gruppe>')[0] || pattern.split('<Gruppe>')[0] === '') {
              return false;
            } else {
              first = 'title';
              pattern = this.filename_pattern.split('<Titel>')[1].split('<Gruppe>')[0];
            }
          } else {
            return false;
          }
          return {
            pattern: pattern,
            first: first
          };
        }
      };
    }
  ]);

}).call(this);
