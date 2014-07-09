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

    # TODO
    # set output destination
    setDestination: (destination) ->
      @destination = destination

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
        $:
          r: row
        c: []
      }
      el.c = _.map data, (item, index) =>
        c = {
          $:
            r: a[index] + row
        }
        if typeof item is 'string'
          c.$.t = 'inlineStr'
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

    # TODO
    buildGrid: (headerData, bodyData, rowToStart) ->
      header = @buildRow headerData, rowToStart, true
      body = _.map bodyData, (data, index) =>
        @buildRow data, rowToStart + index + 1
      body.unshift header
      body

    # TODO
    buildGridWithTitle: (title, header, body, rowToStart) ->
      title = @buildRow [title], rowToStart, true
      body = @buildGrid header, body, rowToStart + 2
      body.unshift title
      body

    # look up sheetName and return xml data for sheet
    getSheet: (sheetName) ->
      xml = {}
      xmlParser.parseString @xlsx.file('xl/workbook.xml').asText(), (err, result) =>
        sheets = result.workbook.sheets[0].sheet
        for sheet in sheets
          if sheet.$.name is sheetName
            path = 'xl/worksheets/sheet' + sheet.$.sheetId + '.xml'
            xmlParser.parseString @xlsx.file(path).asText(), (err, result) ->
              xml = {path: path, xml: result}
      xml

    # add data to sheetName
    # if there are rows already data is appended
    addToSheet: (sheetName, data) ->
      sheet = @getSheet sheetName
      row = sheet.xml.worksheet.sheetData[0].row
      if row
        sheet.xml.worksheet.sheetData[0].row = row.concat @buildRows(data, rows + 2)
      else
        sheet.xml.worksheet.sheetData[0] = {row: @buildRows(data)}
      xml = xmlBuilder.buildObject sheet.xml
      console.log xml
      @xlsx.file(sheet.path, xml)

    # TODO
    addGridWithTitle: (title, header, body, rowToStart, sheet) ->
      data = @buildGridWithTitle title, header, body, rowToStart
      @addToSheet sheet, data
  }