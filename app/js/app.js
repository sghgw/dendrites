(function() {
  this.App = angular.module('dendrites', ['ui.router', 'Controllers', 'dendritesDirectives', 'readXlsFactory', 'XlsxFactory', 'dataFactory', 'dataStoreFactory']);

  this.App.config([
    '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/source');
      return $stateProvider.state('source', {
        url: '/source',
        templateUrl: '../views/source.html',
        controller: 'sourceCtrl'
      }).state('groups', {
        url: '/groups',
        templateUrl: '../views/groups.html',
        controller: 'groupsCtrl'
      }).state('data', {
        url: '/data',
        templateUrl: '../views/data.html',
        controller: 'dataCtrl'
      }).state('preview', {
        url: '/preview',
        templateUrl: '../views/preview.html',
        controller: 'previewCtrl'
      }).state('export', {
        url: '/export',
        templateUrl: '../views/export.html',
        controller: 'exportCtrl'
      });
    }
  ]);

}).call(this);
