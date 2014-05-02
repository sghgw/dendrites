(function() {
  var a, fs, module, xml2js, xmlBuilder, xmlParser, zip;

  xml2js = require('xml2js');

  xmlParser = new xml2js.Parser();

  xmlBuilder = new require('xmlbuilder');

  zip = require('jszip');

  fs = require('fs');

  a = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  module = angular.module('XlsxFactory', []);

  module.factory('Xlsx', function() {
    return {
      destination: '',
      xlsx: {},
      setDestination: function(destination) {
        return this.destination = destination;
      },
      loadTemplate: function() {
        var file;
        file = window.location.pathname.split("views")[0] + 'templates/template.xlsx';
        return this.xlsx = new zip(fs.readFileSync(file));
      },
      generateXlsxFile: function() {
        var buffer;
        buffer = this.xlsx.generate({
          type: 'nodebuffer'
        });
        return fs.writeFile(this.destination, buffer, function(err) {
          if (err) {
            return false;
          }
        });
      },
      buildRow: function(row, data) {
        var c, el, index, item, _i, _len;
        el = xmlBuilder.create('row', {
          headless: true
        });
        el.att('r', row);
        el.ele('c').att('r', 'A' + row).ele('v', row);
        for (index = _i = 0, _len = data.length; _i < _len; index = ++_i) {
          item = data[index];
          c = el.ele('c');
          c.att('r', a[index + 1] + row);
          if (typeof item === 'string') {
            c.att('t', 'inlineStr');
            c.ele('is').ele('t', item);
          } else {
            c.ele('v', item);
          }
        }
        return el.end({
          pretty: true,
          indent: '  ',
          newline: '\n'
        });
      },
      log: function() {
        var _this = this;
        this.loadTemplate();
        console.log(this.xlsx.file('xl/worksheets/sheet1.xml').asText());
        return this.parser.parseString(this.xlsx.file('xl/worksheets/sheet2.xml').asText(), function(err, result) {
          var buffer, data;
          console.log(result);
          result.worksheet.sheetData = {
            row: {
              '$': {
                r: 1
              },
              c: {
                '$': {
                  r: 'A1',
                  t: 'n'
                },
                v: 345
              }
            }
          };
          _this.builder.options.renderOpts.pretty = false;
          data = _this.builder.buildObject(result);
          _this.xlsx.file('xl/worksheets/sheet1.xml', data);
          buffer = _this.xlsx.generate({
            type: 'nodebuffer'
          });
          return _this.fs.writeFile(window.location.pathname.split("views")[0] + 'templates/test.xlsx', buffer, function(err) {
            return console.log(err);
          });
        });
      }
    };
  });

}).call(this);
