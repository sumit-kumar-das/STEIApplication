/*
 * Angular 1.x.x
 * @author Sumit K
 */

var app = angular.module('mainApp', [
  'ngRoute',
  'mainApp.config',
  'mainApp.controller',
  'mainApp.service',
  '720kb.datepicker',
  'ui.grid',
  'ui.grid.pagination',
  'ngSanitize',
  'ngBootbox',
  'checklist-model'
]);

/*
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    
    .when("/home", {templateUrl: "partials/home.html", controller: "HomeCtrl"})
    .when("/welcome", {templateUrl: "partials/welcome.html", controller: "HomeCtrl"})
	  .when("/status", {templateUrl: "partials/status.html", controller: "HomeCtrl"})
	  .when("/manager", {templateUrl: "partials/manager.html", controller: "ManagerCtrl"})
    .when("/editWeek/:param1/:param2", {templateUrl: "partials/editWeek.html", controller: "ManagerCtrl"})
    //Available Pages
    .when("/", {templateUrl: "partials/login.html", controller: "LoginCtrl"})
   
    // Else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "CommonCtrl"});
}]);
