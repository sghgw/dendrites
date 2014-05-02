(function() {
  var a, fs, module, xml2js, xmlBuilder, xmlParser, zip;

  xml2js = require('xml2js');

  xmlParser = new xml2js.Parser();

  xmlBuilder = new xml2js.Builder();

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
      buildRow: function(data, row, hideIndex) {
        var c, el, index, item, _i, _len;
        if (!row) {
          row = 1;
        }
        el = {
          row: {
            $: {
              r: row
            },
            c: []
          }
        };
        if (!hideIndex) {
          el.c.push({
            $: {
              r: 'A' + row
            },
            v: row
          });
        }
        for (index = _i = 0, _len = data.length; _i < _len; index = ++_i) {
          item = data[index];
          c = {
            $: {
              r: a[index + 1] + row
            }
          };
          if (typeof item === 'string') {
            c.$.t = 'inlineStr';
            c.is = {};
            c.is.t = item;
          } else {
            c.v = item;
          }
          el.row.c.push(c);
        }
        return el;
      },
      buildGrid: function(headerData, bodyData, rowToStart) {
        var body, header,
          _this = this;
        header = this.buildRow(headerData, rowToStart, true);
        body = _.map(bodyData, function(data, index) {
          return _this.buildRow(data, rowToStart + index + 1);
        });
        body.unshift(header);
        return body;
      },
      getSheet: function(sheetName) {
        var xml,
          _this = this;
        xml = {};
        if (_.isEmpty(this.xlsx)) {
          this.loadTemplate();
        }
        xmlParser.parseString(this.xlsx.file('xl/workbook.xml').asText(), function(err, result) {
          var path, sheet, sheets, _i, _len, _results;
          sheets = result.workbook.sheets[0].sheet;
          _results = [];
          for (_i = 0, _len = sheets.length; _i < _len; _i++) {
            sheet = sheets[_i];
            if (sheet.$.name === sheetName) {
              path = 'xl/worksheets/sheet' + sheet.$.sheetId + '.xml';
              _results.push(xmlParser.parseString(_this.xlsx.file(path).asText(), function(err, result) {
                return xml = {
                  path: path,
                  xml: result
                };
              }));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        });
        return xml;
      },
      addToSheet: function(sheetName, data) {
        var sheet;
        sheet = this.getSheet(sheetName);
        return sheet.xml.worksheet.sheetData;
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
