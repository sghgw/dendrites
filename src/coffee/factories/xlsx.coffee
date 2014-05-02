xml2js = require 'xml2js'
xmlParser = new xml2js.Parser()
xmlBuilder = new require('xmlbuilder')
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

    buildRow: (data, row, pretty) ->
      row = 1 if !row
      el = xmlBuilder.create 'row', {headless: true}
      el.att 'r', row
      el.ele('c').att('r', 'A' + row).ele 'v', row
      for item, index in data
        c = el.ele('c')
        c.att 'r', a[index + 1] + row
        if typeof item is 'string'
          c.att 't', 'inlineStr'
          c.ele('is').ele 't', item
        else
          c.ele 'v', item
      if pretty then opts = { pretty: true, indent: '  ', newline: '\n' }else opts = {}
      el.end(opts)

    buildGrid: (headerData, bodyData, rowToStart) ->
      header = @buildRow headerData, rowToStart, true
      body = _.map bodyData, (data, index) =>
        @buildRow data, rowToStart + index + 1, true
      header + body.join('')

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