'use strict';

	var app=angular.module('transapp',['ngRoute','ngCookies','ngResource','ui.bootstrap']);
	//app.routers
	app.config( function($routeProvider){
		$routeProvider
		.when('/',{templateUrl:'partials/home.html', controller:"ctrlhome"})
		.when('/manage',{templateUrl:'partials/manage.html', controller:"ctrlmanage"})
		.when('/login',{templateUrl:'partials/login.html', controller:"ctrllogin"})
		.when('/login/:error',{templateUrl:'partials/login.html', controller:"ctrllogin"})

		/*.when('/create',{templateUrl:'partials/create.html', controller:"ctrlcreate"})	*/
		.otherwise({redirectTo:'/'});
	});
