(function() {
  var Datastore, module;

  Datastore = require('nedb');

  module = angular.module('dendritesDBFactory', ['readXlsFactory', 'XlsxFactory']);

  module.factory('dendritesDB', function() {
    return {};
  });

}).call(this);
