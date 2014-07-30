(function() {
  var fs, module, path;

  path = require('path');

  fs = require('fs');

  module = angular.module('readXlsFactory', []);

  module.factory('readXls', function() {
    return {
      start: function(dir, filename) {
        var file;
        file = this.open(dir, filename);
        return this.load(file, filename);
      },
      open: function(dir, file) {
        var data;
        data = fs.readFileSync(dir + '/' + file);
        if (path.extname(file) === '.xls') {
          return XLS.read(data);
        } else {
          return XLSX.read(data);
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
          length: (ss.mean(_.map(dendrite.spines, function(spine) {
            return spine.length;
          }))).toFixed(4) / 1,
          diameter: (ss.mean(_.map(dendrite.spines, function(spine) {
            return spine.diameter;
          }))).toFixed(4) / 1,
          distance: (ss.mean(_.map(dendrite.spines, function(spine) {
            return spine.distance;
          }))).toFixed(4) / 1,
          length_to_center: (ss.mean(_.map(dendrite.spines, function(spine) {
            return spine.length_to_center;
          }))).toFixed(4) / 1
        };
        return dendrite;
      }
    };
  });

}).call(this);
