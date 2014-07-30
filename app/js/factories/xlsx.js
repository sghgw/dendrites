(function() {
  var a, fs, module, os, xml2js;

  xml2js = new X2JS({
    escapeMode: false
  });

  fs = require('fs');

  os = require('os');

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
        if (os.platform().indexOf('win') > -1) {
          file = file.slice(1);
        }
        if (fs.existsSync(file)) {
          this.xlsx = new JSZip(fs.readFileSync(file));
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
          _r: row,
          c: []
        };
        el.c = _.map(data, function(item, index) {
          var c;
          c = {
            _r: a[index] + row
          };
          if (typeof item === 'string') {
            c._t = 'inlineStr';
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
        var path, result, sheet, xml, _i, _len, _ref;
        xml = {};
        result = xml2js.xml_str2json(this.xlsx.file('xl/workbook.xml').asText());
        _ref = result.workbook.sheets.sheet;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          sheet = _ref[_i];
          if (sheet._name === sheetName) {
            path = 'xl/worksheets/sheet' + sheet._sheetId + '.xml';
            result = xml2js.xml_str2json(this.xlsx.file(path).asText());
            xml = {
              path: path,
              xml: result,
              id: sheet._sheetId
            };
          }
        }
        return xml;
      },
      addToSheet: function(sheetName, data, asTable) {
        var row, rows, sheet, xml;
        rows = [];
        sheet = this.getSheet(sheetName);
        row = sheet.xml.worksheet.sheetData.row;
        if (row) {
          row = _.isArray(row) ? row : [row];
          rows = this.buildRows([[]].concat(data), row.length + 1);
          sheet.xml.worksheet.sheetData.row = row.concat(rows);
        } else {
          rows = this.buildRows(data);
          sheet.xml.worksheet.sheetData = {
            row: rows
          };
        }
        if (asTable) {
          sheet.xml = this.createTable(sheet.id, sheet.xml, rows);
        }
        xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + xml2js.json2xml_str(sheet.xml);
        return this.xlsx.file(sheet.path, xml);
      }
    };
  });

}).call(this);
