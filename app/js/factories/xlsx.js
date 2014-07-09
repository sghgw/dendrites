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
      generateXlsxFile: function() {
        var buffer;
        buffer = this.xlsx.generate({
          type: 'nodebuffer'
        });
        fs.writeFile(this.destination, buffer, function(err) {
          if (err) {
            return false;
          }
        });
        return true;
      },
      buildRow: function(data, row, isHeader) {
        var c, col, el, index, item, _i, _len;
        if (!row) {
          row = 1;
        }
        el = {
          $: {
            r: row
          },
          c: []
        };
        if (!isHeader) {
          el.c.push({
            $: {
              r: 'A' + row
            },
            v: row - 1
          });
        }
        col = isHeader ? 0 : 1;
        for (index = _i = 0, _len = data.length; _i < _len; index = ++_i) {
          item = data[index];
          c = {
            $: {
              r: a[index + col] + row
            }
          };
          if (typeof item === 'string') {
            c.$.t = 'inlineStr';
            c.is = {};
            c.is.t = item;
          } else {
            c.v = item;
          }
          el.c.push(c);
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
      buildGridWithTitle: function(title, header, body, rowToStart) {
        title = this.buildRow([title], rowToStart, true);
        body = this.buildGrid(header, body, rowToStart + 2);
        body.unshift(title);
        return body;
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
          sheet.xml.worksheet.sheetData[0].row = row.concat(buildRows(data, rows));
        } else {
          sheet.xml.worksheet.sheetData[0] = {
            row: buildRows(data)
          };
        }
        xml = xmlBuilder.buildObject(sheet.xml);
        return this.xlsx.file(sheet.path, xml);
      },
      addGridWithTitle: function(title, header, body, rowToStart, sheet) {
        var data;
        data = this.buildGridWithTitle(title, header, body, rowToStart);
        return this.addToSheet(sheet, data);
      }
    };
  });

}).call(this);
