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

    buildRow: (data, row, hideIndex) ->
      row = 1 if !row
      el = {
        row:  
          $:
            r: row
          c: []
      }
      el.c.push {
        $:
          r: 'A' + row
        v: row
      } if !hideIndex
      for item, index in data
        c = {
          $:
            r: a[index + 1] + row
        }
        if typeof item is 'string'
          c.$.t = 'inlineStr'
          c.is = {}
          c.is.t = item
        else
          c.v = item
        el.row.c.push c
      return el

    buildGrid: (headerData, bodyData, rowToStart) ->
      header = @buildRow headerData, rowToStart, true
      body = _.map bodyData, (data, index) =>
        @buildRow data, rowToStart + index + 1
      body.unshift header
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
      sheet.xml.worksheet.sheetData
    log: () ->
      @loadTemplate()
      console.log @xlsx.file('xl/worksheets/sheet1.xml').asText()
      @parser.parseString @xlsx.file('xl/worksheets/sheet2.xml').asText(), (err, result) =>
        console.log result
        result.worksheet.sheetData = {
          row:
            '$':
              r: 1
            c:
              '$':
                r: 'A1'
                t: 'n'
              v: 345
        }
        @builder.options.renderOpts.pretty = false
        data = @builder.buildObject(result)
        @xlsx.file('xl/worksheets/sheet1.xml', data)
        buffer = @xlsx.generate {type: 'nodebuffer'}
        @fs.writeFile window.location.pathname.split("views")[0] + 'templates/test.xlsx', buffer, (err) =>
          console.log err
      # console.log @fs.existsSync(file)
  }