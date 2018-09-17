var _ = require('underscore');
window.EnketoForm = require('enketo-core/src/js/Form');

// Missing Bamanankan (bm) Issue #...
require('bootstrap-datepicker/js/locales/bootstrap-datepicker.es');
require('bootstrap-datepicker/js/locales/bootstrap-datepicker.fr');
require('bootstrap-datepicker/js/locales/bootstrap-datepicker.sw');
require('bootstrap-datepicker/js/locales/bootstrap-datepicker.id');
require('./bootstrap-datepicker.hi');

$.fn.datepicker.defaults.container = '.content-pane .enketo';
$.fn.datepicker.defaults.orientation = 'bottom';

function onDocumentReady() {
  var angularServices = angular.element(document.body).injector();
  var Language = angularServices.get('Language');

  Language().then(function(userLanguage) {
    var availableCalendarLanguages = Object.keys($.fn.datepicker.dates);
    var calendarLanguage = _.contains(availableCalendarLanguages, userLanguage) ? userLanguage : 'en';
    $.fn.datepicker.defaults.language = calendarLanguage;
  });
}

module.exports = onDocumentReady;
