'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngTouch',
  'ngRoute',
  'myApp.animations',
  /*'myApp.filters',*/
  'myApp.directives',
  'myApp.controllers',
  'ngSanitize',
  'ui.bootstrap',
  'myApp.services'
]).
config(['$routeProvider', function($routeProvider) {
 
  $routeProvider.when('/inbox', {
  	templateUrl: 'partials/inbox.html', 
  	controller: 'InboxCtrl',	
  	resolve: {
			fetchedInbox: function(DBService) {
				return DBService.fetchInbox();
			},
			fetcedCourses: function(DBService) {
				return DBService.fetchCourses();
			},
			fetcedProfessors: function(DBService) {
				return DBService.fetchProfessors();
			}
	}
  }); 
  $routeProvider.when('/slides', {
  	templateUrl: 'partials/slides.html', 
  	controller: 'SlidesCtrl',
  	resolve: {
			fetcedCourses: function(DBService) {
				return DBService.fetchCourses();
			},
			fetcedSlides: function(DBService) {
				return DBService.fetchSlides();
			},
			fetcedProfessors: function(DBService) {
				return DBService.fetchProfessors();
			}
	}
  });   
  $routeProvider.when('/blackListedSlides', {
  	templateUrl: 'partials/blackListedSlides.html', 
  	controller: 'BlackListedSlidesCtrl',	
  	resolve: {
			fetchedBlackListedSlides: function(DBService) {
				return DBService.fetchBlackListedSlides();
			}
	}
  }); 
  
  $routeProvider.when('/courses', {
  	templateUrl: 'partials/courses.html', 
  	controller: 'CoursesCtrl',
  	resolve: {
			fetcedCourses: function(DBService) {
				return DBService.fetchCourses();
			},
			fetcedSlides: function(DBService) {
				return DBService.fetchSlides();
			},
			fetcedProfessors: function(DBService) {
				return DBService.fetchProfessors();
			}
	}
  });
  
  $routeProvider.when('/coursesManage', {
  	templateUrl: 'partials/coursesManage.html', 
  	controller: 'CoursesManageCtrl',
  	resolve: {
			fetcedCourses: function(DBService) {
				return DBService.fetchCourses();
			},
			fetcedProfessors: function(DBService) {
				return DBService.fetchProfessors();
			}
	}
  });  
   
//  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/courses'});
}]);
