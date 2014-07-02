xml2js = require 'xml2js'
xmlParser = new xml2js.Parser()
# xmlBuilder = new require('xmlbuilder')
xmlBuilder = new xml2js.Builder()
zip = require 'jszip'
fs = require 'fs'
a = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

module = angular.module 'XlsxFactory', []

module.factory 'Xlsx', () ->
  {
    destination: ''
    xlsx: {}
    setDestination: (destination) ->
      @destination = destination

    loadTemplate: () ->
      file = window.location.pathname.split("views")[0] + 'templates/template.xlsx'
      @xlsx = new zip(fs.readFileSync(file))

    generateXlsxFile: () ->
      buffer = @xlsx.generate {type: 'nodebuffer'}
      fs.writeFile @destination, buffer, (err) ->
        return false if err
      true

    buildRow: (data, row, isHeader) ->
      row = 1 if !row
      el = {
        $:
          r: row
        c: []
      }
      el.c.push {
        $:
          r: 'A' + row
        v: row - 1
      } if !isHeader
      col = if isHeader then 0 else 1
      for item, index in data
        c = {
          $:
            r: a[index + col] + row
        }
        if typeof item is 'string'
          c.$.t = 'inlineStr'
          c.is = {}
          c.is.t = item
        else
          c.v = item
        el.c.push c
      return el

    buildGrid: (headerData, bodyData, rowToStart) ->
      header = @buildRow headerData, rowToStart, true
      body = _.map bodyData, (data, index) =>
        @buildRow data, rowToStart + index + 1
      body.unshift header
      body

    buildGridWithTitle: (title, header, body, rowToStart) ->
      title = @buildRow [title], rowToStart, true
      body = @buildGrid header, body, rowToStart + 2
      body.unshift title
      body

    getSheet: (sheetName) ->
      xml = {}
      @loadTemplate() if _.isEmpty @xlsx
      xmlParser.parseString @xlsx.file('xl/workbook.xml').asText(), (err, result) =>
        sheets = result.workbook.sheets[0].sheet
        for sheet in sheets
          if sheet.$.name is sheetName
            path = 'xl/worksheets/sheet' + sheet.$.sheetId + '.xml'
            xmlParser.parseString @xlsx.file(path).asText(), (err, result) ->
              xml = {path: path, xml: result}
      xml

    addToSheet: (sheetName, data) ->
      sheet = @getSheet sheetName
      if sheet.xml.worksheet.sheetData[0].row
        sheet.xml.worksheet.sheetData[0].row = sheet.xml.worksheet.sheetData[0].row.concat data
      else
        sheet.xml.worksheet.sheetData[0] = {row: data}
      xml = xmlBuilder.buildObject sheet.xml
      @xlsx.file(sheet.path, xml)

    addGridWithTitle: (title, header, body, rowToStart, sheet) ->
      data = @buildGridWithTitle title, header, body, rowToStart
      @addToSheet sheet, data
  }