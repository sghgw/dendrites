(function() {
  var module, path, stats, xls, xlsx;

  xls = require('xlsjs');

  xlsx = require('xlsx');

  path = require('path');

  stats = require('simple-statistics');

  module = angular.module('readXlsFactory', []);

  module.factory('readXls', function() {
    return {
      start: function(dir, filename) {
        var file;
        file = this.open(dir, filename);
        return this.load(file, filename);
      },
      open: function(dir, file) {
        if (path.extname(file) === '.xls') {
          return xls.readFile(dir + '/' + file);
        } else {
          return xlsx.readFile(dir + '/' + file);
        }
      },
      load: function(file, filename) {
        var dendrite, i, spine, _i, _ref;
        dendrite = {
          file: filename,
          group: '',
          title: path.basename(filename, '.xls', '.xlsx'),
          length: file.Sheets['Each Tree-Dendrite']['D2'].v.toFixed(1) / 1,
          surface: file.Sheets['Each Tree-Dendrite']['G2'].v,
          volume: file.Sheets['Each Tree-Dendrite']['J2'].v,
          total_spines: file.Sheets['Each Tree-Dendrite']['R2'].v,
          spines: []
        };
        dendrite.spine_density = (dendrite.total_spines / dendrite.length).toFixed(4) / 1;
        for (i = _i = 2, _ref = dendrite.total_spines + 1; 2 <= _ref ? _i <= _ref : _i >= _ref; i = 2 <= _ref ? ++_i : --_i) {
          spine = {
            length: file.Sheets['Spine Details']['E' + i].v,
            diameter: file.Sheets['Spine Details']['F' + i].v,
            distance: file.Sheets['Spine Details']['G' + i].v,
            length_to_center: file.Sheets['Spine Details']['D' + i].v
          };
          dendrite.spines.push(spine);
        }
        dendrite.spine_means = {
          length: stats.mean(_.map(dendrite.spines, function(spine) {
            return spine.length;
          })),
          diameter: stats.mean(_.map(dendrite.spines, function(spine) {
            return spine.diameter;
          })),
          distance: stats.mean(_.map(dendrite.spines, function(spine) {
            return spine.distance;
          })),
          length_to_center: stats.mean(_.map(dendrite.spines, function(spine) {
            return spine.length_to_center;
          }))
        };
        return dendrite;
      }
    };
  });

}).call(this);
