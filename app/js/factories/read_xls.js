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
        return this.load();
      },
      open: function(dir, file) {
        this.file = this.path.extname(file) === '.xls' ? this.xls.readFile(dir + '/' + file) : this.xlsx.readFile(dir + '/' + file);
        return console.log(this.file.SheetNames);
      },
      load: function() {
        var i;
        this.dendrite = {
          length: this.file.Sheets['Each Tree-Dendrite']['D2'].v,
          total_spines: this.file.Sheets['Each Tree-Dendrite']['R2'].v
        };
        this.dendrite.spines = (function() {
          var _i, _ref, _results;
          _results = [];
          for (i = _i = 2, _ref = this.dendrite.total_spines + 1; 2 <= _ref ? _i <= _ref : _i >= _ref; i = 2 <= _ref ? ++_i : --_i) {
            _results.push(this.file.Sheets['Spine Details']['E' + i].v);
          }
          return _results;
        }).call(this);
        this.dendrite.mean_spine_length = this.stats.mean(this.dendrite.spines);
        return console.log(this.dendrite);
      }
    };
  });

}).call(this);
