(function() {
  var a, fs, module, xml2js, xmlBuilder, xmlParser, zip;

  xml2js = require('xml2js');

  xmlParser = new xml2js.Parser();

  xmlBuilder = new xml2js.Builder({
    renderOpts: {
      pretty: false
    }
  });

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
                  xml: result,
                  id: sheet.$.sheetId
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
      addToSheet: function(sheetName, data, asTable, rowToStart) {
        var row, rows, sheet, xml;
        rows = [];
        sheet = this.getSheet(sheetName);
        row = sheet.xml.worksheet.sheetData[0].row;
        if (row) {
          if (rowToStart) {
            rows = this.buildRows(data, rowToStart);
            sheet.xml.worksheet.sheetData[0].row = (row.slice(0, rowToStart - 1).concat(rows)).concat(row.slice(rowToStart + rows.length - 1));
          } else {
            rows = this.buildRows([[]].concat(data), row.length + 1);
            sheet.xml.worksheet.sheetData[0].row = row.concat(rows);
          }
        } else {
          rows = this.buildRows(data);
          sheet.xml.worksheet.sheetData[0] = {
            row: rows
          };
        }
        if (asTable) {
          sheet.xml = this.createTable(sheet.id, sheet.xml, rows);
        }
        xml = xmlBuilder.buildObject(sheet.xml);
        return this.xlsx.file(sheet.path, xml);
      },
      createTable: function(id, sheet, rows) {
        var path, rId, ref, rels, tId, table, tableParts, xml;
        rId = '';
        tableParts = sheet.worksheet.tableParts;
        if (tableParts) {
          tableParts.$.count += 1;
          rId = tableParts.$.count;
          tableParts.tablePart.push({
            $: {
              'r:id': 'rId' + rId
            }
          });
        } else {
          rId = 1;
          tableParts = {
            $: {
              count: 1
            },
            tablePart: [
              {
                $: {
                  'r:id': 'rId' + rId
                }
              }
            ]
          };
        }
        sheet.worksheet.tableParts = tableParts;
        tId = this.xlsx.file('xl/tables') ? this.xlsx.file('xl/tables').length + 1 : 1;
        ref = rows[0].c[0].$.r + ':' + rows[rows.length - 1].c[rows[rows.length - 1].c.length - 1].$.r;
        console.log(rows[0].c);
        table = {
          table: {
            $: {
              xmlns: 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
              id: tId,
              name: 'Tabelle' + tId,
              displayName: 'Tabelle' + tId,
              ref: ref,
              totalsRowShown: 0
            },
            autoFilter: {
              $: {
                ref: ref
              }
            },
            tableColumns: {
              $: {
                count: rows[0].c.length
              },
              tableColumn: []
            },
            tableStyleInfo: {
              $: {
                name: "TableStyleLight1",
                showFirstColumn: 0,
                showLastColumn: 0,
                showRowStripes: 1,
                showColumnStripes: 0
              }
            }
          }
        };
        table.table.tableColumns.tableColumn = _.map(rows[0].c, function(item, index) {
          return {
            $: {
              id: index + 1,
              name: item.is.t || item.v
            }
          };
        });
        xml = xmlBuilder.buildObject(table);
        console.log(xml);
        this.xlsx.file('xl/tables/table' + tId + '.xml', xml);
        rels = {};
        path = 'xl/worksheets/_rels/sheet' + id + '.xml.rels';
        if (this.xlsx.file(path)) {
          xmlParser.parseString(this.xlsx.file(path).asText(), function(err, result) {
            return rels = result;
          });
        } else {
          rels = {
            Relationships: {
              $: {
                xmlns: "http://schemas.openxmlformats.org/package/2006/relationships"
              },
              Relationship: []
            }
          };
        }
        rels.Relationships.Relationship.push({
          $: {
            Id: 'rId' + rId,
            Type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/table",
            Target: '../tables/table' + tId + '.xml'
          }
        });
        this.xlsx.file(path, xmlBuilder.buildObject(rels));
        return sheet;
      }
    };
  });

}).call(this);
