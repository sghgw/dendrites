xml2js = new X2JS({escapeMode:false});
zip = require 'jszip'
fs = require 'fs'
a = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

module = angular.module 'XlsxFactory', []

module.factory 'Xlsx', () ->
  {
    xlsx: {}

    # set Excel template file
    setTemplate: (template) ->
      template = 'template' if !template
      file = window.location.pathname.split("views")[0] + 'templates/' + template + '.xlsx'
      if fs.existsSync(file)
        @xlsx = new zip(fs.readFileSync(file))
        return true
      else 
        return false

    # TODO
    # write output to new Excel file
    generateXlsxFile: (destination) ->
      buffer = @xlsx.generate {type: 'nodebuffer'}
      fs.writeFile destination, buffer, (err) ->
        return false if err
      true

    buildRow: (data, row) ->
      row = 1 if !row
      el = {
        _r: row
        c: []
      }
      el.c = _.map data, (item, index) =>
        c = {
          _r: a[index] + row
        }
        if typeof item is 'string'
          c._t = 'inlineStr'
          c.is = {t: item}

        else
          c.v = item
        c
      return el

    buildRows: (rowsData, row) ->
      row = 1 if !row
      rows = _.map rowsData, (data, index) =>
        @buildRow data, row + index
      rows

    # look up sheetName and return xml data for sheet
    getSheet: (sheetName) ->
      xml = {}
      result = xml2js.xml_str2json @xlsx.file('xl/workbook.xml').asText()
      for sheet in result.workbook.sheets.sheet
        if sheet._name is sheetName
          path = 'xl/worksheets/sheet' + sheet._sheetId + '.xml'
          result = xml2js.xml_str2json @xlsx.file(path).asText()
          xml = {path: path, xml: result, id: sheet._sheetId}
      xml

    # add data to sheetName
    # if there are rows already data is appended
    addToSheet: (sheetName, data, asTable) ->
      rows = []
      sheet = @getSheet sheetName
      row = sheet.xml.worksheet.sheetData.row 
      if row
        row = if _.isArray(row) then row else [row]
        rows = @buildRows([[]].concat(data), row.length + 1)
        sheet.xml.worksheet.sheetData.row = row.concat rows
      else
        rows = @buildRows(data)
        sheet.xml.worksheet.sheetData = {row: rows}
      sheet.xml = @createTable(sheet.id, sheet.xml, rows) if asTable
      xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + xml2js.json2xml_str sheet.xml
      @xlsx.file(sheet.path, xml)

    # createTable: (id, sheet, rows) ->
    #   # get tableParts object and add tablePart for new table
    #   rId = ''
    #   tableParts = sheet.worksheet.tableParts
    #   if tableParts
    #     tableParts.$.count += 1
    #     rId = tableParts.$.count
    #     tableParts.tablePart.push {
    #       $:
    #         'r:id': 'rId' + rId
    #     }
    #   else
    #     rId = 1
    #     tableParts = {
    #       $:
    #         count: 1
    #       tablePart: [{
    #         $:
    #           'r:id': 'rId' + rId
    #       }]
    #     }
    #   sheet.worksheet.tableParts = tableParts

    #   # create table XML file
    #   tId = if @xlsx.file('xl/tables') then @xlsx.file('xl/tables').length + 1 else 1
    #   ref = rows[0].c[0].$.r + ':' + rows[rows.length - 1].c[rows[rows.length - 1].c.length - 1].$.r
    #   console.log rows[0].c
    #   table = {
    #     table:
    #       $:
    #         xmlns: 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
    #         id: tId
    #         name: 'Tabelle' + tId
    #         displayName: 'Tabelle' + tId
    #         ref: ref
    #         totalsRowShown: 0
    #       autoFilter: {
    #         $:
    #           ref: ref
    #       }
    #       tableColumns: 
    #         $:
    #           count: rows[0].c.length
    #         tableColumn: []
    #       tableStyleInfo:
    #         $:
    #           name: "TableStyleLight1" 
    #           showFirstColumn: 0 
    #           showLastColumn: 0 
    #           showRowStripes: 1 
    #           showColumnStripes:0
    #   }
    #   table.table.tableColumns.tableColumn = _.map rows[0].c, (item, index) ->
    #     {
    #       $:
    #         id: index + 1
    #         name: item.is.t or item.v
    #     }
    #   xml = xmlBuilder.buildObject table
    #   console.log xml
    #   @xlsx.file 'xl/tables/table' + tId + '.xml', xml

    #   # add relationship tag
    #   rels = {}
    #   path = 'xl/worksheets/_rels/sheet' + id + '.xml.rels'
    #   if @xlsx.file path
    #     xmlParser.parseString @xlsx.file(path).asText(), (err, result) ->
    #       rels = result
    #   else
    #     rels = {
    #       Relationships:
    #         $:
    #           xmlns: "http://schemas.openxmlformats.org/package/2006/relationships"
    #         Relationship: []
    #     }
    #   rels.Relationships.Relationship.push {
    #     $:
    #       Id:'rId' + rId
    #       Type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/table"
    #       Target: '../tables/table' + tId + '.xml'
    #   }
    #   @xlsx.file path, xmlBuilder.buildObject(rels)
    #   sheet
  }