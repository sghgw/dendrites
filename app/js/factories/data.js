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
        filename_delimiter_presets: [
          {
            name: 'Unterstrich',
            delimiter: '_'
          }, {
            name: 'Bindestrich',
            delimiter: '-'
          }
        ],
        filename_delimiter: '_',
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
          dataStore.clearDendritesTable();
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
          var groups, p,
            _this = this;
          p = this.checkPattern();
          if (!p) {
            return false;
          }
          groups = _.countBy(this.dendrites, function(dendrite) {
            var group, parts, title;
            parts = dendrite.file.split('.xls')[0].split(_this.filename_delimiter);
            title = _.map(p.title, function(i) {
              return parts[i];
            }).join(_this.filename_delimiter);
            group = _.map(p.group, function(i) {
              return parts[i];
            }).join(_this.filename_delimiter);
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
          var group, i, p, parts, title, _i, _len;
          parts = this.filename_pattern.split(this.filename_delimiter);
          group = [];
          title = [];
          for (i = _i = 0, _len = parts.length; _i < _len; i = ++_i) {
            p = parts[i];
            if (p === '<Gruppe>') {
              group.push(i);
            }
            if (p === '<Titel>') {
              title.push(i);
            }
          }
          return {
            group: group,
            title: title
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
          var dendrite, dendritesData, exportSpines, groupSpines, index, spines, spinesData, _i, _len;
          exportSpines = _.contains(_.values(this.data_options.spines), true);
          groupSpines = this.data_options.spines.grouped_length && this.data_options.spines.groups.length > 0 ? true : false;
          spines = [];
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
            if (groupSpines) {
              spines = spines.concat(dendrite.spines);
            }
          }
          if (groupSpines) {
            spinesData = this.prepareGroupedSpinesData(spinesData, spines);
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
        },
        prepareGroupedSpinesData: function(table, spines) {
          var group, groups, index, item, row, spine, _i, _j, _k, _len, _len1, _len2, _ref;
          groups = [['Gruppe', 'Untere Grenze', 'Obere Grenze', 'Spines, absolut', 'Spines, relativ']];
          _ref = this.data_options.spines.groups;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            group = _ref[_i];
            row = [group.name, group.range[0], group.range[1], 0];
            for (_j = 0, _len1 = spines.length; _j < _len1; _j++) {
              spine = spines[_j];
              if (spine.length >= group.range[0] && spine.length < group.range[1]) {
                row[row.length - 1]++;
              }
            }
            row.push(row[row.length - 1] / spines.length);
            groups.push(row);
          }
          for (index = _k = 0, _len2 = groups.length; _k < _len2; index = ++_k) {
            item = groups[index];
            table[index] = table[index].concat(['', ''].concat(item));
          }
          return table;
        }
      };
    }
  ]);

}).call(this);
