(function() {
  var module;

  module = angular.module('readXlsFactory', []);

  module.factory('readXls', function() {
    return {
      xls: require('xlsjs'),
      xlsx: require('xlsx'),
      stats: require('simple-statistics'),
      path: require('path'),
      start: function(dir, file, options) {
        file = this.open(dir, file);
        return this.load(file, options);
      },
      open: function(dir, file) {
        if (this.path.extname(file) === '.xls') {
          return this.xls.readFile(dir + '/' + file);
        } else {
          return this.xlsx.readFile(dir + '/' + file);
        }
      },
      load: function(file, options) {
        var dendrite, i;
        dendrite = {
          spines: {}
        };
        if (options.dendrite.length) {
          dendrite.length = file.Sheets['Each Tree-Dendrite']['D2'].v;
        }
        if (options.dendrite.surface) {
          dendrite.surface = file.Sheets['Each Tree-Dendrite']['G2'].v;
        }
        if (options.dendrite.volume) {
          dendrite.volume = file.Sheets['Each Tree-Dendrite']['J2'].v;
        }
        if (options.dendrite.total_spines) {
          dendrite.total_spines = file.Sheets['Each Tree-Dendrite']['R2'].v;
        }
        if (options.spines.length || options.dendrite.mean_spine_length || options.spines.grouped_length) {
          dendrite.spines.length = (function() {
            var _i, _ref, _results;
            _results = [];
            for (i = _i = 2, _ref = dendrite.total_spines + 1; 2 <= _ref ? _i <= _ref : _i >= _ref; i = 2 <= _ref ? ++_i : --_i) {
              _results.push(file.Sheets['Spine Details']['E' + i].v);
            }
            return _results;
          })();
        }
        if (options.spines.diameter) {
          dendrite.spines.diameter = (function() {
            var _i, _ref, _results;
            _results = [];
            for (i = _i = 2, _ref = dendrite.total_spines + 1; 2 <= _ref ? _i <= _ref : _i >= _ref; i = 2 <= _ref ? ++_i : --_i) {
              _results.push(file.Sheets['Spine Details']['F' + i].v);
            }
            return _results;
          })();
        }
        if (options.spines.distance) {
          dendrite.spines.distance = (function() {
            var _i, _ref, _results;
            _results = [];
            for (i = _i = 2, _ref = dendrite.total_spines + 1; 2 <= _ref ? _i <= _ref : _i >= _ref; i = 2 <= _ref ? ++_i : --_i) {
              _results.push(file.Sheets['Spine Details']['G' + i].v);
            }
            return _results;
          })();
        }
        if (options.spines.length_to_center) {
          dendrite.spines.length_to_center = (function() {
            var _i, _ref, _results;
            _results = [];
            for (i = _i = 2, _ref = dendrite.total_spines + 1; 2 <= _ref ? _i <= _ref : _i >= _ref; i = 2 <= _ref ? ++_i : --_i) {
              _results.push(file.Sheets['Spine Details']['D' + i].v);
            }
            return _results;
          })();
        }
        if (options.dendrite.mean_spine_length) {
          dendrite.mean_spine_length = this.stats.mean(dendrite.spines.length);
        }
        if (options.dendrite.spine_density) {
          dendrite.spine_density = dendrite.total_spines / dendrite.length;
        }
        if (options.spines.grouped_length) {
          dendrite.spines.grouped_length = _.countBy(dendrite.spines.length, function(spine) {
            if (spine < 0.5) {
              return '< 0,5';
            }
            if ((0.5 <= spine && spine < 1)) {
              return '0,5 - 1';
            }
            if ((1 <= spine && spine < 1.5)) {
              return '1 - 1,5';
            }
            if ((1.5 <= spine && spine < 2)) {
              return '1,5 - 2';
            }
            if (spine > 2) {
              return '> 2';
            }
          });
        }
        return dendrite;
      }
    };
  });

}).call(this);
