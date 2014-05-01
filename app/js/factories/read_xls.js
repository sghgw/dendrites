(function() {
  var module;

  module = angular.module('readXlsFactory', []);

  module.factory('readXls', function() {
    return {
      xls: require('xlsjs'),
      xlsx: require('xlsx'),
      stats: require('simple-statistics'),
      path: require('path'),
      start: function(dir, file) {
        file = this.open(dir, file);
        return this.load(file);
      },
      open: function(dir, file) {
        if (this.path.extname(file) === '.xls') {
          return this.xls.readFile(dir + '/' + file);
        } else {
          return this.xlsx.readFile(dir + '/' + file);
        }
      },
      load: function(file) {
        var dendrite, i;
        dendrite = {
          length: file.Sheets['Each Tree-Dendrite']['D2'].v,
          spines: {
            total: file.Sheets['Each Tree-Dendrite']['R2'].v
          }
        };
        dendrite.spines.data = (function() {
          var _i, _ref, _results;
          _results = [];
          for (i = _i = 2, _ref = dendrite.spines.total + 1; 2 <= _ref ? _i <= _ref : _i >= _ref; i = 2 <= _ref ? ++_i : --_i) {
            _results.push(file.Sheets['Spine Details']['E' + i].v);
          }
          return _results;
        })();
        dendrite.spines.mean_length = this.stats.mean(dendrite.spines.data);
        dendrite.spines.density = dendrite.spines.total / dendrite.length;
        return dendrite;
      }
    };
  });

}).call(this);
