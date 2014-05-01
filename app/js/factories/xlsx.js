(function() {
  var fs, module, xml2js, xmlBuilder, xmlParser, zip;

  xml2js = require('xml2js');

  xmlParser = new xml2js.Parser();

  xmlBuilder = new xml2js.Builder();

  zip = require('jszip');

  fs = require('fs');

  module = angular.module('XlsxFactory', []);

  module.factory('Xlsx', function() {
    return {
      destination: '',
      xlsx: {},
      setDestination: function(destination) {
        this.destination = destination;
        return console.log(this.destination);
      },
      loadTemplate: function() {
        var file;
        file = window.location.pathname.split("views")[0] + 'templates/template.xlsx';
        return this.xlsx = new this.zip(this.fs.readFileSync(file));
      },
      generateXlsxFile: function() {
        var buffer;
        return buffer = this.xlsx.generate({
          type: 'nodebuffer'
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
