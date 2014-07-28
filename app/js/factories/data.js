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
            length: true,
            diameter: false,
            distance: false,
            length_to_center: false,
            grouped_length: false,
            groups: []
          }
        },
        loadFileList: function(source) {
          var files;
          if (fs.existsSync(source)) {
            this.source = source;
            files = _.filter(fs.readdirSync(source), function(file) {
              return _.contains(['.xls', '.xlsx'], path.extname(file));
            });
            return this.loadDendriteData(files);
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
          Xlsx.setTemplate('template2');
          if (this.grouping) {
            this.addTablesForGroups();
          } else {
            this.addTableFor(this.dendrites, 'Alle Daten');
          }
          return Xlsx.generateXlsxFile(this.destination);
        },
        addTableFor: function(dendrites, title) {
          var dendrite, dendritesData, exportSpines, index, spinesData, _i, _len;
          exportSpines = _.contains(_.values(this.data_options.spines), true);
          Xlsx.addToSheet('Dendriten', [[title]]);
          if (exportSpines) {
            Xlsx.addToSheet('Spines', [[title]]);
          }
          dendritesData = [this.prepareDendriteHeader()];
          if (exportSpines) {
            spinesData = [this.prepareSpinesHeader()];
          }
          for (index = _i = 0, _len = dendrites.length; _i < _len; index = ++_i) {
            dendrite = dendrites[index];
            dendritesData.push(this.prepareDendriteData(dendrite, index + 1));
            if (exportSpines) {
              spinesData = spinesData.concat(this.prepareSpinesData(dendrite.spines, dendrite.title, spinesData.length - 1));
            }
          }
          Xlsx.addToSheet('Dendriten', dendritesData, false);
          return Xlsx.addToSheet('Spines', spinesData);
        },
        addTablesForGroups: function() {
          var dendrites, group, index, title, _i, _len, _ref, _results;
          _ref = this.groups;
          _results = [];
          for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
            group = _ref[index];
            title = group.title ? group.title : group.id;
            dendrites = _.where(this.dendrites, {
              group: group.id
            });
            _results.push(this.addTableFor(dendrites, title));
          }
          return _results;
        },
        prepareDendriteData: function(dendrite, index) {
          var data;
          data = [];
          if (index) {
            data.push(index);
          }
          data.push(dendrite.title);
          if (this.data_options.dendrite.length) {
            data.push(dendrite.length);
          }
          if (this.data_options.dendrite.surface) {
            data.push(dendrite.surface);
          }
          if (this.data_options.dendrite.volume) {
            data.push(dendrite.volume);
          }
          if (this.data_options.dendrite.total_spines) {
            data.push(dendrite.total_spines);
          }
          if (this.data_options.dendrite.spine_density) {
            data.push(dendrite.spine_density);
          }
          if (this.data_options.dendrite.spine_means.length) {
            data.push(dendrite.spine_means.length);
          }
          if (this.data_options.dendrite.spine_means.diameter) {
            data.push(dendrite.spine_means.diameter);
          }
          if (this.data_options.dendrite.spine_means.distance) {
            data.push(dendrite.spine_means.distance);
          }
          if (this.data_options.dendrite.spine_means.length_to_center) {
            data.push(dendrite.spine_means.length_to_center);
          }
          return data;
        },
        prepareDendriteHeader: function() {
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
        },
        prepareSpinesHeader: function() {
          var data;
          data = [];
          data.push('#');
          data.push('Dendrit');
          if (this.data_options.spines.length) {
            data.push('L\u00e4nge');
          }
          if (this.data_options.spines.diameter) {
            data.push('Durchmesser');
          }
          if (this.data_options.spines.distance) {
            data.push('Distanz');
          }
          if (this.data_options.spines.length_to_center) {
            data.push('L\u00e4nge zur Mitte');
          }
          return data;
        },
        prepareSpinesData: function(spines, dendrite, index) {
          var _this = this;
          return _.map(spines, function(spine, n) {
            var data;
            data = [];
            data.push(index + n + 1);
            if (dendrite) {
              data.push(dendrite);
            }
            if (_this.data_options.spines.length) {
              data.push(spine.length);
            }
            if (_this.data_options.spines.diameter) {
              data.push(spine.diameter);
            }
            if (_this.data_options.spines.distance) {
              data.push(spine.distance);
            }
            if (_this.data_options.spines.length_to_center) {
              data.push(spine.length_to_center);
            }
            return data;
          });
        }
      };
    }
  ]);

}).call(this);
