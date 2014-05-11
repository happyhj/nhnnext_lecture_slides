'use strict';

/* Directives */
var lectureCatalogDirectives = angular.module('myApp.directives', []);


/*
socialCommentPortalDirectives.directive('appVersion', ['version', 
	function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }
]);


 // blur 이벤트 시에만 validation 정보를 보여주기위해 만든 지시자.
 
socialCommentPortalDirectives.directive('ngFocus', [function() {
  var FOCUS_CLASS = "ng-focused";
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ctrl) {
 
      ctrl.$focused = false;
		
      if (attrs.ngFocus === "focusMe") {
					element[0].focus();
          scope[attrs.focusMe] = false;
          ctrl.$focused = true;
      }
          
      element.bind('focus', function(evt) {
        element.addClass(FOCUS_CLASS);
        scope.$apply(function() {
        	ctrl.$focused = true;
        });
      }).bind('blur', function(evt) {
        element.removeClass(FOCUS_CLASS);
        scope.$apply(function() {
        	ctrl.$focused = false;
        });
      });
    
    }
  }
}]);

socialCommentPortalDirectives.directive('ensureUnique', ['$http', function($http) {
  return {
    require: 'ngModel',
    link: function(scope, ele, attrs, ctrl) {
      scope.$watch(attrs.ngModel, function() {
         var reqURL ="http://localhost:8080/api/v1/users/"+ctrl.$viewValue;
	       $http({
	          method: 'GET',
	          url: reqURL,
	        }).success(function(data, status, headers, cfg) {
	          ctrl.$setValidity('unique', data.isAvailable);
	        }).error(function(data, status, headers, cfg) {
	          ctrl.$setValidity('unique', false);
	        });
      });
    }
  }
}]);

// 문지기 방어코드 
socialCommentPortalDirectives.directive('checkUser', ['$rootScope', '$location', 'UserService', function ($root, $location, userSrv) {
	return {
		link: function (scope, elem, attrs, ctrl) {
				$root.$on('$routeChangeSuccess', function(angularEvent, currView, prevView){
					console.log("checking User!");					
					
					console.log(userSrv);
					if(currView.$$route.access) {
						// 페이지 라우팅을 시작할 때. 라우팅 목표페이지의 권한설정과 
						if (!currView.$$route.access.isAccessibleWhenSignedIn && userSrv.loginStatus === "signedIn") {
							$location.path('/');						
						}
						if (!currView.$$route.access.isAccessibleWhenSignedOut && userSrv.loginStatus === "signedOut") {
							$location.path('/login');						
						}
						if (userSrv.loginStatus === "unactivated") {
							$location.path('/join/accountActivateNotice');						
						}
					}
					
			});
		}
	}
}]);
*/
