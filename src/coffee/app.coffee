# initialize angular app

@App = angular.module 'dendrites', [
  'ui.router',
  'Controllers',
  'dendritesDirectives',
  'readXlsFactory',
  'XlsxFactory',
  'dataFactory',
  'dataStoreFactory'
]

# config routes

@App.config ['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) ->
  $urlRouterProvider.otherwise '/source'

  $stateProvider
    .state('source', {
      url: '/source'
      templateUrl: '../views/source.html'
      controller: 'sourceCtrl'
    })
    .state('groups', {
      url: '/groups'
      templateUrl: '../views/groups.html'
      controller: 'groupsCtrl'
    })
    .state('data', {
      url: '/data'
      templateUrl: '../views/data.html'
      controller: 'dataCtrl'
    })
    .state('preview', {
      url: '/preview'
      templateUrl: '../views/preview.html'
      controller: 'previewCtrl'
    })
    .state('export', {
      url: '/export'
      templateUrl: '../views/export.html'
      controller: 'exportCtrl'
    })
]