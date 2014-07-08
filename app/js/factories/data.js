(function() {
  var fs, module, path;

  fs = require('fs');

  path = require('path');

  module = angular.module('dataFactory', ['readXlsFactory', 'XlsxFactory', 'dataStoreFactory']);

  module.factory('Data', [
    'readXls', 'Xlsx', 'dataStore', function(readXls, Xlsx, dataStore) {
      return {
        dendrites: [],
        groups: [],
        filename_pattern: '<Gruppe>_<Titel>',
        grouping: false,
        loaded_data: false,
        data_options: {
          dendrite: {
            length: true,
            surface: false,
            volume: false,
            total_spines: true,
            spine_density: true,
            spine_means: {
              length: true,
              diameter: false,
              distance: false,
              length_to_center: false
            }
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
            this.loadDendriteData(files);
            return this.destination = source + '/Auswertung.xlsx';
          }
        },
        loadDendriteData: function(files) {
          var data, file, _i, _len;
          for (_i = 0, _len = files.length; _i < _len; _i++) {
            file = files[_i];
            data = readXls.start(this.source, file);
            dataStore.addDendrite(data);
          }
          return this.getDendriteData();
        },
        getDendriteData: function() {
          var _this = this;
          return dataStore.getDendrites().then(function(dendrites) {
            return _this.dendrites = dendrites;
          });
        },
        getGroups: function() {
          var groups, p;
          p = this.checkPattern();
          if (!p) {
            return false;
          }
          groups = _.countBy(this.dendrites, function(dendrite) {
            var group, title;
            group = p.first === 'group' ? dendrite.file.split(p.pattern)[0] : dendrite.file.split(p.pattern).slice(1).join(p.pattern).split(path.extname(dendrite.file))[0];
            title = p.first === 'title' ? dendrite.file.split(p.pattern)[0] : dendrite.file.split(p.pattern).slice(1).join(p.pattern).split(path.extname(dendrite.file))[0];
            dataStore.updateDendrite(dendrite._id, {
              title: title,
              group: group
            });
            return group;
          });
          this.getDendriteData();
          return this.groups = _.map(_.pairs(groups), function(group) {
            return {
              id: group[0],
              dendrites: group[1],
              title: ''
            };
          });
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
        },
        exportData: function() {
          Xlsx.setDestination(this.destination);
          if (this.grouping) {
            this.addTablesForGroups();
          } else {
            this.addTableFor(this.files, 'Alle Daten');
          }
          return Xlsx.generateXlsxFile();
        },
        addTableFor: function(files, title, rowToStart) {
          var body,
            _this = this;
          if (!rowToStart) {
            rowToStart = 1;
          }
          body = _.map(files, function(file) {
            return _this.prepareDendriteData(file);
          });
          return Xlsx.addGridWithTitle(title, this.prepareTableHeader(), body, rowToStart, "\u00dcbersicht");
        },
        addTablesForGroups: function() {
          var files, group, header, index, row, title, _i, _len, _ref, _results;
          header = this.prepareTableHeader();
          row = 1;
          _ref = this.groups;
          _results = [];
          for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
            group = _ref[index];
            title = group.title ? group.title : group.id;
            files = _.where(this.files, {
              group: group.id
            });
            this.addTableFor(files, title, row);
            _results.push(row += files.length + 5);
          }
          return _results;
        },
        prepareDendriteData: function(file) {
          var data;
          data = [];
          data.push(file.title);
          if (this.data_options.dendrite.length) {
            data.push(file.dendrite.length);
          }
          if (this.data_options.dendrite.surface) {
            data.push(file.dendrite.surface);
          }
          if (this.data_options.dendrite.volume) {
            data.push(file.dendrite.volume);
          }
          if (this.data_options.dendrite.total_spines) {
            data.push(file.dendrite.total_spines);
          }
          if (this.data_options.dendrite.spine_density) {
            data.push(file.dendrite.spine_density);
          }
          if (this.data_options.dendrite.mean_spine_length) {
            data.push(file.dendrite.mean_spine_length);
          }
          return data;
        },
        prepareTableHeader: function() {
          var data;
          data = [];
          data.push('#');
          data.push('Dendrit');
          if (this.data_options.dendrite.length) {
            data.push('L\u00e4nge');
          }
          if (this.data_options.dendrite.surface) {
            data.push('Oberfl\u00e4che');
          }
          if (this.data_options.dendrite.volume) {
            data.push('Volumen');
          }
          if (this.data_options.dendrite.total_spines) {
            data.push('Spineanzahl');
          }
          if (this.data_options.dendrite.spine_density) {
            data.push('Spinedichte');
          }
          if (this.data_options.dendrite.spine_means.length) {
            data.push('Mittlere Spinel\u00e4nge');
          }
          if (this.data_options.dendrite.spine_means.diameter) {
            data.push('Mittler Spinedurchmesser');
          }
          if (this.data_options.dendrite.spine_means.distance) {
            data.push('Mittlere Spinedistanz');
          }
          if (this.data_options.dendrite.spine_means.length_to_center) {
            data.push('Mittlere Spinel\u00e4nge zum Zentrum');
          }
          return data;
        }
      };
    }
  ]);

}).call(this);
