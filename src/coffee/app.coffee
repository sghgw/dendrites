# initialize angular append

@App = angular.module 'dendrites', [
  'Controllers',
  'dendritesDirectives',
  'readXlsFactory',
  'XlsxFactory',
  'dataFactory',
  'dendritesDBFactory'
]