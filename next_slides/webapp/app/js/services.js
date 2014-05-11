'use strict';

/* Services */
// 서버 도메인 
//var serverDomain = 'http://www.heej.net:9999/';
var serverDomain = 'http://localhost:54000/nextslides/';

//var serverDomain = 'http://nigayo.com/nextslides/';

var lectureCatalogServices = angular.module('myApp.services', []);

lectureCatalogServices.factory('DBService', ['$http', '$q', function($http, $q) {
	console.log("init DBService");
	
	var sdu = {
		slides: [], // 'signedIn', 'signedOut', 'unactivated'
		courses: [],
		professors: [],
		getSlideById: function(slideId) {
			for(var i in this.slides) {
				if(this.slides[i].id == slideId) {
					return this.slides[i];
				}
			}
		},
		loadInbox: function(callback) {
			$http({
					url: serverDomain+'api/1/inbox',
					method: "GET"
				}).success(function (data, status, headers, config) {
					//$scope.persons = data; // assign  $scope.persons here as promise is resolved here 
					callback(data);
				}).error(function (data, status, headers, config) {
					alert("에러가 발생하였습니다. 서버가 요청에 제대로 응답하지 않습니다.");
				}
			);			
		},
		loadBlackListedSlides: function(callback) {
			$http({
					url: serverDomain+'api/1/blackListedSlides',
					method: "GET"
				}).success(function (data, status, headers, config) {
					//$scope.persons = data; // assign  $scope.persons here as promise is resolved here 
					callback(data);
				}).error(function (data, status, headers, config) {
					alert("에러가 발생하였습니다. 서버가 요청에 제대로 응답하지 않습니다.");
				}
			);			
		},	
		loadSlides: function(callback) {
			$http({
					url: serverDomain+'api/1/Slides',
					method: "GET"
				}).success(function (data, status, headers, config) {
					//$scope.persons = data; // assign  $scope.persons here as promise is resolved here 
					callback(data);
				}).error(function (data, status, headers, config) {
					alert("에러가 발생하였습니다. 서버가 요청에 제대로 응답하지 않습니다.");
				}
			);			
		},	
		fetchBlackListedSlides: function() {
			return $http.get(serverDomain+'api/1/blackListedSlides')
				.then(function(response) {
				console.log("blackListedSlides 정보를 받음!");
			    if (typeof response.data === 'object') {
			        return response.data.data;
			    } else {
			        // invalid response
			        return $q.reject(response.data);
			    }		
				}, function(response) {
			    // something went wrong
			    console.log("something went wrong");
			    return $q.reject(response.data);
				}
			);		
		},
		fetchSlides: function() {
			return $http.get(serverDomain+'api/1/slides')
				.then(function(response) {
				console.log("slides 정보를 받음!");
			    if (typeof response.data === 'object') {
			        return response.data;
			    } else {
			        // invalid response
			        return $q.reject(response.data);
			    }		
				}, function(response) {
			    // something went wrong
			    console.log("something went wrong");
			    return $q.reject(response.data);
				}
			);		
		},
		fetchCourses: function() {
			return $http.get(serverDomain+'api/1/courses')
				.then(function(response) {
				console.log("courses 정보를 받음!");
			    if (typeof response.data === 'object') {
			        return response.data;
			    } else {
			        // invalid response
			        return $q.reject(response.data);
			    }		
				}, function(response) {
			    // something went wrong
			    console.log("something went wrong");
			    return $q.reject(response.data);
				}
			);		
		},
		fetchProfessors: function() {
			return $http.get(serverDomain+'api/1/professors')
				.then(function(response) {
				console.log("professors 정보를 받음!");
			    if (typeof response.data === 'object') {
			        return response.data;
			    } else {
			        // invalid response
			        return $q.reject(response.data);
			    }		
				}, function(response) {
			    // something went wrong
			    console.log("something went wrong");
			    return $q.reject(response.data);
				}
			);		
		},
		fetchInbox: function() {
			return $http.get(serverDomain+'api/1/inbox')
				.then(function(response) {
				console.log("inbox 정보를 받음!");
			    if (typeof response.data === 'object') {
			        return response.data;
			    } else {
			        // invalid response
			        return $q.reject(response.data);
			    }		
				}, function(response) {
			    // something went wrong
			    console.log("something went wrong");
			    return $q.reject(response.data);
				}
			);		
		}
	};
	
	return sdu;
}]);

