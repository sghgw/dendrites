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
        this.open(dir, file);
        this.load();
        return this.dendrite;
      },
      open: function(dir, file) {
        return this.file = this.path.extname(file) === '.xls' ? this.xls.readFile(dir + '/' + file) : this.xlsx.readFile(dir + '/' + file);
      },
      load: function() {
        var i;
        this.dendrite = {
          length: this.file.Sheets['Each Tree-Dendrite']['D2'].v,
          spines: {
            total: this.file.Sheets['Each Tree-Dendrite']['R2'].v
          }
        };
        this.dendrite.spines.data = (function() {
          var _i, _ref, _results;
          _results = [];
          for (i = _i = 2, _ref = this.dendrite.spines.total + 1; 2 <= _ref ? _i <= _ref : _i >= _ref; i = 2 <= _ref ? ++_i : --_i) {
            _results.push(this.file.Sheets['Spine Details']['E' + i].v);
          }
          return _results;
        }).call(this);
        this.dendrite.spines.mean_length = this.stats.mean(this.dendrite.spines.data);
        return this.dendrite.spines.density = this.dendrite.spines.total / this.dendrite.length;
      }
    };
  });

}).call(this);
