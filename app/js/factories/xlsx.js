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
      xlsx: {},
      setTemplate: function(template) {
        var file;
        if (!template) {
          template = 'template';
        }
        file = window.location.pathname.split("views")[0] + 'templates/' + template + '.xlsx';
        if (fs.existsSync(file)) {
          this.xlsx = new zip(fs.readFileSync(file));
          return true;
        } else {
          return false;
        }
      },
      generateXlsxFile: function(destination) {
        var buffer;
        buffer = this.xlsx.generate({
          type: 'nodebuffer'
        });
        fs.writeFile(destination, buffer, function(err) {
          if (err) {
            return false;
          }
        });
        return true;
      },
      buildRow: function(data, row) {
        var el,
          _this = this;
        if (!row) {
          row = 1;
        }
        el = {
          $: {
            r: row
          },
          c: []
        };
        el.c = _.map(data, function(item, index) {
          var c;
          c = {
            $: {
              r: a[index] + row
            }
          };
          if (typeof item === 'string') {
            c.$.t = 'inlineStr';
            c.is = {
              t: item
            };
          } else {
            c.v = item;
          }
          return c;
        });
        return el;
      },
      buildRows: function(rowsData, row) {
        var rows,
          _this = this;
        if (!row) {
          row = 1;
        }
        rows = _.map(rowsData, function(data, index) {
          return _this.buildRow(data, row + index);
        });
        return rows;
      },
      getSheet: function(sheetName) {
        var xml,
          _this = this;
        xml = {};
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
        var row, sheet, xml;
        sheet = this.getSheet(sheetName);
        row = sheet.xml.worksheet.sheetData[0].row;
        if (row) {
          sheet.xml.worksheet.sheetData[0].row = row.concat(this.buildRows(data, row.length + 2));
        } else {
          sheet.xml.worksheet.sheetData[0] = {
            row: this.buildRows(data)
          };
        }
        xml = xmlBuilder.buildObject(sheet.xml);
        return this.xlsx.file(sheet.path, xml);
      }
    };
  });

}).call(this);
