xml2js = require 'xml2js'
module = angular.module 'XlsxFactory', []

module.factory 'Xlsx', () ->
  {
    zip: require 'jszip'
    fs: require 'fs'
    parser: new xml2js.Parser()
    builder: new xml2js.Builder()
    destination: ''
    xlsx: {}
    loadTemplate: () ->
      file = window.location.pathname.split("views")[0] + 'templates/template.xlsx'
      @xlsx = new @zip(@fs.readFileSync(file))
    generateXlsxFile: () ->
      buffer = @xlsx.generate {type: 'nodebuffer'}
      # send file to user...
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