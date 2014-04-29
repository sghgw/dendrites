module = angular.module 'XlsxFactory', []

module.factory 'Xlsx', () ->
  {
    zip: new require('jszip')
    log: () ->
      console.log @zip
  }