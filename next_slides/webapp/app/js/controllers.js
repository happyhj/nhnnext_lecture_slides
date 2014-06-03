'use strict';

/* Controllers */
/*
angular.module('myApp.controllers', []).
  controller('SessionNewCtrl', [function() {

  }]);
  */
/// 도구 마련	
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}  



var lectureCatalogControllers = angular.module('myApp.controllers', []);


lectureCatalogControllers.controller('navController', ['$rootScope','$scope', '$http', '$location',
	function($rootScope,$scope,$http,$location) {
	    $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
	      console.log('Current route name: ' + $location.path());
	      if($location.path()==="/slides") {
			$scope.inboxClassName = "";
	   		$scope.slidesClassName = "selected";
	   		$scope.coursesClassName = "";
	   		$scope.blackListedSlidesClassName = "";		      
	      }else if($location.path()==="/inbox"){
			$scope.inboxClassName = "selected";
	   		$scope.slidesClassName = "";
	   		$scope.coursesClassName = "";
	   		$scope.blackListedSlidesClassName = "";			      
	      }else if($location.path()==="/blackListedSlides") {
			$scope.inboxClassName = "";
	   		$scope.slidesClassName = "";
	   		$scope.coursesClassName = "";
	   		$scope.blackListedSlidesClassName = "selected";			      
	      }else if($location.path()==="/courses") {
			$scope.inboxClassName = "";
	   		$scope.slidesClassName = "";
	   		$scope.coursesClassName = "selected";
	   		$scope.blackListedSlidesClassName = "";			      
	      }
	    });
   	}]
);

lectureCatalogControllers.controller('InboxCtrl', ['$scope', '$http', '$location','DBService','fetcedCourses','fetchedInbox','fetcedProfessors',
	function($scope,$http,$location,DBService,fetcedCourses,fetchedInbox,fetcedProfessors) {
   		console.log("init InboxCtrl");					
   	
		DBService.courses = fetcedCourses.data;
		DBService.slides = fetchedInbox.data;
		DBService.professors = fetcedProfessors.data;

    	$scope.slides = DBService.slides;
		$scope.courses = DBService.courses;
		$scope.professors = DBService.professors;   	
   	
    	$scope.updateInbox = function() {
			// 인박스의 데이터를 업데이트하고(서버사이드에서) 인박스의 정보를 가져옵니다.			
			$http({
					url: serverDomain+'api/1/updateIndox',
					method: "GET"
				}).success(function (data, status, headers, config) {
					//$scope.persons = data; // assign  $scope.persons here as promise is resolved here 
					console.log("reload inbox");
					DBService.loadInbox(function(data){
						$scope.slides = data.data;
						console.log("reload inbox - success");
						$scope.decodeHangulInbox();
					});
				}).error(function (data, status, headers, config) {
					alert("에러가 발생하였습니다. 서버가 요청에 제대로 응답하지 않습니다.");
				}
			);			
    	};

    	$scope.addToCatalog = function(id) {
    		var targetSlide;
    		for(var i in $scope.slides) {
	    		if($scope.slides[i].id === id) {
		    		targetSlide = $scope.slides[i];
		    		break;
	    		}
    		}
     		// tags 스트링을 스트링의 배열로 나누기
    		if(targetSlide.tags) {
	    		targetSlide.tags = targetSlide.tags.split(",");
	    		for(var i in targetSlide.tags) {
		    		targetSlide.tags[i] = targetSlide.tags[i].trim();
	    		}
			}
			if(targetSlide.course_id) {
				targetSlide.course_id = parseInt(targetSlide.course_id);
				console.log(JSON.stringify(targetSlide.course_id));
			}
			
			if(typeof targetSlide.description === "object") {
				targetSlide.description = "";
			}
			
    		console.log("보낼 슬라이드");
    		
    		var postOption = {
				url: serverDomain+'api/1/slides',
				method: "POST",
				data: JSON.stringify(targetSlide)
			};
				
    		// 해당슬라이드 blacklist DB에 추가하고 inbox DB 에서 지우는 요청 하고나서 
			$http(postOption).success(function (data, status, headers, config) {
					if(data.status == 200) {
						$http({
								url: serverDomain+'api/1/inbox/'+id,
								method: "DELETE"
							}).success(function (data, status, headers, config) {
								console.log(id+"인 슬라이드를 카탈로그로 잘 옮겼습니다.");
								DBService.loadInbox(function(data){
									$scope.slides = data.data;
									console.log("reload inbox - success");
									$scope.decodeHangulInbox();
								});				
							}).error(function (data, status, headers, config) {
								alert("에러가 발생하였습니다. 서버가 요청에 제대로 응답하지 않습니다.");
							}
						);											
					}
				}).error(function (data, status, headers, config) {
					alert("에러가 발생하였습니다. 서버가 요청에 제대로 응답하지 않습니다.");
				}
			);  
			
			
    	}
 
    	$scope.modifyTitle = function(id) {
    		var targetSlide;
    		for(var i in $scope.slides) {
	    		if($scope.slides[i].id === id) {
		    		targetSlide = $scope.slides[i];
		    		break;
	    		}
    		}
    		var newTitle = prompt("슬라이드 제목을 수정하세요",targetSlide.title);
			if (newTitle != "")
			{
			  targetSlide.title = newTitle;			 
			}
    	}
    	
    	$scope.modifyDescription= function(id) {
    		var targetSlide;
    		for(var i in $scope.slides) {
	    		if($scope.slides[i].id === id) {
		    		targetSlide = $scope.slides[i];
		    		break;
	    		}
    		}
    		var newDescription = prompt("슬라이드 설명을 수정하세요",targetSlide.description);
			    		//alert(JSON.stringify(newDescription));
			if (newDescription)
			{ 
				targetSlide.description = newDescription;	
			}
    	}
    	$scope.deleteDescription= function(id) {
    		var targetSlide;
    		for(var i in $scope.slides) {
	    		if($scope.slides[i].id === id) {
		    		targetSlide = $scope.slides[i];
		    		break;
	    		}
    		}
    		targetSlide.description = "";	
    	}    	    	   	    	
    	$scope.addToBlackList = function(id) {
    		var targetSlide;
    		for(var i in $scope.slides) {
	    		if($scope.slides[i].id === id) {
		    		targetSlide = $scope.slides[i];
		    		break;
	    		}
    		}
    		// 해당슬라이드 blacklist DB에 추가하고 inbox DB 에서 지우는 요청 하고나서 
			$http({
					url: serverDomain+'api/1/blackListedSlides',
					method: "POST",
					data: targetSlide
				}).success(function (data, status, headers, config) {
					if(data.status == 200) {
						$http({
								url: serverDomain+'api/1/inbox/'+id,
								method: "DELETE"
							}).success(function (data, status, headers, config) {
								console.log(id+"인 슬라이드를 블랙리스트로 잘 옮겼습니다.");
								console.log("reload inbox");
								DBService.loadInbox(function(data){
									$scope.slides = data.data;
									console.log("reload inbox - success");
									$scope.decodeHangulInbox();
								});							
							}).error(function (data, status, headers, config) {
								alert("에러가 발생하였습니다. 서버가 요청에 제대로 응답하지 않습니다.");
							}
						);											
					}
				}).error(function (data, status, headers, config) {
					alert("에러가 발생하였습니다. 서버가 요청에 제대로 응답하지 않습니다.");
				}
			);  	
    	}
    	
    	$scope.decodeHangulInbox = function() {
    		// DB의 inbox 슬라이드들을 화면에 추가해준다.
			console.log("decode Hangul Inbox items");			
			// 모든항목의 타이틀과 설명의 utf8한글코드를 일반 한글로 디코딩
			for(var i in $scope.slides) {
				$scope.slides[i].title = decodeHtmlNumeric($scope.slides[i].title);
				if($scope.slides[i].description.length) {
					$scope.slides[i].description = decodeHtmlNumeric($scope.slides[i].description);
				}
			}
			for(var i in $scope.courses) {
				$scope.courses[i].name_ko = decodeHtmlNumeric($scope.courses[i].name_ko);
			}
			for(var i in $scope.professors) {
				$scope.professors[i].name = decodeHtmlNumeric($scope.professors[i].name);
			}				
    	};  
    	
    	// 슬라이드의 소속 가능성이 있는 강의들을 반환 
    	$scope.isCourseAvailable = function(username) {
	    	//var username = course.username;
	    	return function(course) {
	    		var realname = getRealName(username);
	    		if(course.id === 0) {
		    		return true;
	    		}
	    		return isProfessorIn(course,realname);
	    	};
    	}
    	
    	function isProfessorIn(course,professorName) {
    		for(var i in course.instructor) {   			
    			if(course.instructor[i] === professorName) {
	    			return true;
    			}	    				    		
	    	}
	    	return false;	
    	}   
    	 	
    	function getRealName(username) {
    		for(var i in $scope.professors) {
	    		if($scope.professors[i].slideshare_username == username) {
		    		return $scope.professors[i].name;
	    		}
    		}
			return false;
    	}
    	
		function decodeHtmlNumeric( str ) {
			return str.replace( /&#([0-9]{1,7});/g, function( g, m1 ){
		        return String.fromCharCode( parseInt( m1, 10 ) );
		    }).replace( /&#[xX]([0-9a-fA-F]{1,6});/g, function( g, m1 ){
		        return String.fromCharCode( parseInt( m1, 16 ) );
		    });
		}	
		$scope.orderProperty = 'created'; 		
    	$scope.decodeHangulInbox();  	

		// 슬라이드마다 해당하는 교수님의 이름을 author 키애 넣어준다, 유저네임은 username
		for(var i in $scope.professors) {
			$scope.professors[i].name = decodeHtmlNumeric($scope.professors[i].name);
			for(var j in $scope.slides) {
				if($scope.slides[j].username == $scope.professors[i].slideshare_username) {
					$scope.slides[j].author = $scope.professors[i].name;
					continue;
				}
			}
		}
			
    }
]);

lectureCatalogControllers.controller('BlackListedSlidesCtrl', ['$scope', '$http', '$location','DBService','fetchedBlackListedSlides',
	function($scope,$http,$location,DBService,fetchedBlackListedSlides) {
    	console.log("init BlackListedSlidesCtrl");

		DBService.slides = fetchedBlackListedSlides;    	
    	$scope.slides = DBService.slides;
		$scope.courses = DBService.courses;
		$scope.professors = DBService.professors;  
		    	
    	$scope.deleteFromBlackList = function(id) {
    		var targetSlide;
    		for(var i in $scope.slides) {
	    		if($scope.slides[i].id === id) {
		    		targetSlide = $scope.slides[i];
		    		break;
	    		}
    		}
    		
    		// 해당슬라이드 blacklist DB에 추가하고 inbox DB 에서 지우는 요청 하고나서 
			$http({
					url: serverDomain+'api/1/blackListedSlides/'+targetSlide.id,
					method: "DELETE",
				}).success(function (data, status, headers, config) {
					if(data.status == 200) {
						console.log(id+"인 슬라이드를 블랙리스트에서 잘 지웠습니다.");
						DBService.loadBlackListedSlides(function(data){
							$scope.slides = data.data;
							decodeSlideTitleText();
						});									
					}
				}).error(function (data, status, headers, config) {
					alert("에러가 발생하였습니다. 서버가 요청에 제대로 응답하지 않습니다.");
				}
			);  	
    	}
    	
		function decodeSlideTitleText() {

			for(var i in $scope.slides) {
				$scope.slides[i].title = decodeHtmlNumeric($scope.slides[i].title);
				if($scope.slides[i].description.length) {
					$scope.slides[i].description = decodeHtmlNumeric($scope.slides[i].description);
				}
			}
		}    	
		
		function decodeHtmlNumeric( str ) {
			return str.replace( /&#([0-9]{1,7});/g, function( g, m1 ){
		        return String.fromCharCode( parseInt( m1, 10 ) );
		    }).replace( /&#[xX]([0-9a-fA-F]{1,6});/g, function( g, m1 ){
		        return String.fromCharCode( parseInt( m1, 16 ) );
		    });
		}	
		
    	decodeSlideTitleText();  
    	
 		// 슬라이드마다 해당하는 교수님의 이름을 author 키애 넣어준다, 유저네임은 username
		for(var i in $scope.professors) {
			$scope.professors[i].name = decodeHtmlNumeric($scope.professors[i].name);
			for(var j in $scope.slides) {
				if($scope.slides[j].username == $scope.professors[i].slideshare_username) {
					$scope.slides[j].author = $scope.professors[i].name;
					continue;
				}
			}
		}
    }
]);

lectureCatalogControllers.controller('SlidesCtrl', ['$scope', '$http', '$location', '$sce', 'DBService','fetcedCourses','fetcedSlides','fetcedProfessors',
	function($scope,$http,$location,$sce,DBService,fetcedCourses,fetcedSlides,fetcedProfessors) {
		console.log('init SlidesCtrl');
		DBService.courses = fetcedCourses.data;
		DBService.slides = fetcedSlides.data;
		DBService.professors = fetcedProfessors.data;


    	$scope.slides = DBService.slides;
		$scope.courses = DBService.courses;
		$scope.professors = DBService.professors;

		    	$scope.deleteSlide = function(id) {
		    		var targetSlide;;
		    		
		    		for(var i in $scope.slides) {
			    		if($scope.slides[i].id === id) {
				    		targetSlide = $scope.slides[i];
				    		break;
			    		}
		    		}	    		
		    		// 해당슬라이드 blacklist DB에 추가하고 inbox DB 에서 지우는 요청 하고나서 
					$http({
							url: serverDomain+'api/1/slides/'+targetSlide.id,
							method: "DELETE",
						}).success(function (data, status, headers, config) {
							if(data.status == 200) {
								console.log(id+"인 슬라이드를 카탈로그에서 잘 지웠습니다.");
								DBService.loadSlides(function(data){
									$scope.slides = data.data;
									decodeSlideTitleText();
								});								
							}
						}).error(function (data, status, headers, config) {
							alert("에러가 발생하였습니다. 서버가 요청에 제대로 응답하지 않습니다.");
						}
					);  	
		    	}
		function decodeSlideTitleText() {

			for(var i in $scope.slides) {
				$scope.slides[i].title = decodeHtmlNumeric($scope.slides[i].title);
				if($scope.slides[i].description.length) {
					$scope.slides[i].description = decodeHtmlNumeric($scope.slides[i].description);
				}
			}
		} 
    	$scope.initSlides = function() {
    		// DB의 inbox 슬라이드들을 화면에 추가해준다.
			console.log("init & enhence Slides items");
			// 제목과 상세설명의 한글과 특문을 디코딩
			for(var i in $scope.slides) {
				$scope.slides[i].title = decodeHtmlNumeric($scope.slides[i].title);
				if($scope.slides[i].description.length) {
					$scope.slides[i].description = decodeHtmlNumeric($scope.slides[i].description);
				}
				$scope.slides[i].isViewerOn = false;
			}
			// 슬라이드마다 해당하는 코스의 객체와 제목을 달아준다.
			for(var i in $scope.courses) {
				$scope.courses[i].name_ko = decodeHtmlNumeric($scope.courses[i].name_ko);
				// $scope.slides 모든 아이템에 해당하는 course 객체 삽입한다.
				for(var j in $scope.slides) {
					if($scope.slides[j].course_id == $scope.courses[i].id) {
						$scope.slides[j].course = $scope.courses[i];
						$scope.slides[j].courseName = $scope.courses[i].name_ko;
						continue;
					}
				}
			}
			// 슬라이드마다 해당하는 교수님의 이름을 author 키애 넣어준다, 유저네임은 username
			for(var i in $scope.professors) {
				$scope.professors[i].name = decodeHtmlNumeric($scope.professors[i].name);
				for(var j in $scope.slides) {
					if($scope.slides[j].username == $scope.professors[i].slideshare_username) {
						$scope.slides[j].author = $scope.professors[i].name;
						continue;
					}
				}
			}
			// 슬라이드 created를 yyyy-mm-dd 양식으로 잘라준다... 필터에서만 처리해 준다면 필요없을 수도 있다.
			for(var j in $scope.slides) {
				$scope.slides[j].created = $scope.slides[j].created.substr(0, 10);
			}

    	};
    	
		function decodeHtmlNumeric( str ) {
			return str.replace( /&#([0-9]{1,7});/g, function( g, m1 ){
		        return String.fromCharCode( parseInt( m1, 10 ) );
		    }).replace( /&#[xX]([0-9a-fA-F]{1,6});/g, function( g, m1 ){
		        return String.fromCharCode( parseInt( m1, 16 ) );
		    });
		}
		
		$scope.orderProperty = 'courseName'; 		
    	$scope.initSlides();     
	}
]);

					
lectureCatalogControllers.controller('SlidePreviewModalCtrl', ['$rootScope','$scope', '$http', '$modal', 'DBService','$sce',
  function ($root,$scope, $http, $modal,DBService,$sce) {	
	  console.log('init SlidePreviewModalCtrl');
	 
	  $scope.open = function (slide_id) {	
			var embed;
				 	// embed 코드를 API 를 통해 가져온후 아래 코드는 콜백으로 처리한다.
				$scope.loading = true;
				$.ajax({
				  url: serverDomain + 'api/1/slideshare?identifier='+slide_id+'&type=id',
				  method: "get"
				}).success((function(result) {
			$scope.loading = false;
							var json = JSON.parse(result);
							console.log(json.slideshow.embed);
							embed = json.slideshow.embed;
							
							
		  var currentItem = DBService.getSlideById(slide_id);
	  	  var modalInstance = $modal.open({
	      templateUrl: 'partials/slidePreviewModalContent.html',
	      controller: function ($rootScope,$scope, $modalInstance) {			
				$scope.$on('$locationChangeStart', function(scope, next, current){
					$scope.close();
				});
				
				$scope.isModalOpened = false;
				
				$modalInstance.opened.then(function(result) {
					$scope.isModalOpened = true;
				});
				
			 	$scope.currentItem = currentItem;
			 	
			 	console.log(DBService.slides);
			 	

				// 슬라이드 셰어 임베딩 코드의 사이즈를 조절한다
				$scope.currentItem.embed = embed.replace("https","http");
				if($scope.currentItem.embed.indexOf("&lt;div") != -1) 
					$scope.currentItem.embed = $scope.currentItem.embed.substring(0, $scope.currentItem.embed.indexOf("&lt;div"));

				var viewportWidth = $(window).width();
				var viewportHeight = $(window).height();
				
				$scope.currentItem.embed = $scope.currentItem.embed.replace("width=&quot;427&quot;","width=&quot;"+viewportHeight*4+"&quot;");
				$scope.currentItem.embed = $scope.currentItem.embed.replace("height=&quot;356&quot;","height=&quot;"+viewportHeight*0.7+"&quot;");
			 	$scope.currentItem.embedForApply = $sce.trustAsHtml(htmlDecode($scope.currentItem.embed));
			 	
				function htmlDecode(input){
				  	var e = document.createElement('div');
				  	e.innerHTML = input;
				  	return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
				}	

				$scope.close = function () {
			    	$modalInstance.dismiss('cancel');
			    	$modalInstance.result.then(function() {
				    	$scope.isModalOpened = false;
			    	});
				}	

		   }
	    });							
							
							
							
							
				}).bind(this));
				 


	  };
  }
]);

// 슬라이드 정보 수정 모달 컨드롤러
lectureCatalogControllers.controller('SlideInfoModalCtrl', ['$rootScope','$scope', '$http', '$modal', 'DBService','$sce',
	function ($root,$scope, $http, $modal,DBService,$sce) {
	
		$scope.slides = DBService.slides;
		$scope.courses = DBService.courses;
		$scope.professors = DBService.professors;  
		
		console.log('init SlideInfoModalCtrl');
		
		// 슬라이드의 소속 가능성이 있는 강의들을 반환 
		$scope.isCourseAvailable = function(username) {
			console.log("실행은되냐");
			//var username = course.username;
			return function(course) {
				if(course.id === 0) {
					return true;
				}
				var realname = getRealName(username);
				return isProfessorIn(course,realname);
			};
		}
		
		function isProfessorIn(course,professorName) {
			for(var i in course.instructor) {
				if(course.instructor[i] === professorName) {
					return true;
				}	    				    		
			}
			return false;	
		}
	
    	function getRealName(username) {
    		for(var i in $scope.professors) {
	    		if($scope.professors[i].slideshare_username == username) {
		    		return $scope.professors[i].name;
	    		}
    		}
			return false;
    	}

					  
		$scope.open = function (slide_id) {			
			var currentItem = DBService.getSlideById(slide_id);
			var availableCourses = [];
			
			var test = $scope.isCourseAvailable(currentItem.username);
			var t_idx;
			for(var i in $scope.courses) {
				if(test($scope.courses[i],getRealName(currentItem.username))) {	
					if(currentItem.course_id === $scope.courses[i].id)
						t_idx = i;
					else
						availableCourses.push($scope.courses[i]);
				}
			} 		  
			availableCourses.splice(0, 0, $scope.courses[t_idx]);

			var modalInstance = $modal.open({
				templateUrl: 'partials/slideInfoModalContent.html',
				controller: function ($rootScope,$scope, $modalInstance) {			
					$scope.$on('$locationChangeStart', function(scope, next, current){
						$scope.close();
					});
				
					$scope.isModalOpened = false;
					
					$modalInstance.opened.then(function(result) {
						$scope.isModalOpened = true;
					});
					
					$scope.currentItem = currentItem;
					$scope.availableCourses = availableCourses;
		
					function decodeSlideTitleText() {
						for(var i in $scope.slides) {
							$scope.slides[i].title = decodeHtmlNumeric($scope.slides[i].title);
							if($scope.slides[i].description.length) {
								$scope.slides[i].description = decodeHtmlNumeric($scope.slides[i].description);
							}
						}
					}    	
				
					function decodeHtmlNumeric( str ) {
						return str.replace( /&#([0-9]{1,7});/g, function( g, m1 ){
					        return String.fromCharCode( parseInt( m1, 10 ) );
					    }).replace( /&#[xX]([0-9a-fA-F]{1,6});/g, function( g, m1 ){
					        return String.fromCharCode( parseInt( m1, 16 ) );
					    });
					}	

					$scope.updateSlideInfo = function () {
						var targetSlide = $scope.currentItem;
						delete targetSlide["$$hashKey"];
						console.log(targetSlide);		    		
			    		
			    		var postOption = {
							url: serverDomain+'api/1/slides/'+targetSlide.id,
							method: "PUT",
							data: JSON.stringify(targetSlide)
						};
							
			    		// 해당슬라이드 blacklist DB에 추가하고 inbox DB 에서 지우는 요청 하고나서 
						$http(postOption).success(function (data, status, headers, config) {
								if(data.status == 200) {
									console.log(id+"인 슬라이드를 잘 수정했습니다.");
									DBService.loadSlides(function(data){
										$scope.slides = data.data;
										console.log("reload slides - success");
										$scope.decodeHangulInbox();
									});										
								}
							}).error(function (data, status, headers, config) {
								alert("에러가 발생하였습니다. 서버가 요청에 제대로 응답하지 않습니다.");
							}
						);  						

				    	$modalInstance.dismiss('cancel');
				    	$modalInstance.result.then(function() {
					    	$scope.isModalOpened = false;
				    	});
					}			
		
					$scope.close = function () {
				    	$modalInstance.dismiss('cancel');
				    	$modalInstance.result.then(function() {
					    	$scope.isModalOpened = false;
				    	});
					}	  
				}
			});
		};
	}
]);
 

lectureCatalogControllers.controller('CoursesCtrl', ['$scope', '$http', '$location', '$sce', 'DBService','fetcedCourses','fetcedSlides','fetcedProfessors',
	function($scope,$http,$location,$sce,DBService,fetcedCourses,fetcedSlides,fetcedProfessors) {
		console.log('init CoursesCtrl');
		DBService.courses = fetcedCourses.data;
		DBService.slides = fetcedSlides.data;
		DBService.professors = fetcedProfessors.data;


    	$scope.slides = DBService.slides;
		$scope.courses = DBService.courses;
		$scope.professors = DBService.professors;

		$scope.isPreviewClosed = function() {
			for( var i in $scope.courses) {
				if($scope.courses[i].isExpanded == true) {
					return false;
				}
			}
			return true;
		}
		
    	$scope.initCourses = function() {
    		// DB의 inbox 슬라이드들을 화면에 추가해준다.
			console.log("init & enhence Courses items");
			for(var j in $scope.slides) {
				$scope.slides[j].updated = $scope.slides[j].updated.substr(0, 10);
				$scope.slides[j].created = $scope.slides[j].created.substr(0, 10);
			}
			
			// 슬라이드마다 해당하는 코스의 객체와 제목을 달아준다.
			for(var i in $scope.courses) {
				$scope.courses[i].name_ko = decodeHtmlNumeric($scope.courses[i].name_ko);
				$scope.courses[i].thumbnail_URL = serverDomain + $scope.courses[i].thumbnail_URL;
				// $scope.slides 모든 아이템에 해당하는 course 객체 삽입한다.
				$scope.courses[i].slides =  [];
				for(var j in $scope.slides) {
					if($scope.slides[j].course_id == $scope.courses[i].id) {
						$scope.courses[i].slides.push($scope.slides[j]);
						continue;
					}
				}
			}
			/*
			// 슬라이드마다 해당하는 교수님의 이름을 author 키애 넣어준다, 유저네임은 username
			for(var i in $scope.professors) {
				$scope.professors[i].name = decodeHtmlNumeric($scope.professors[i].name);
				for(var j in $scope.slides) {
					if($scope.slides[j].username == $scope.professors[i].slideshare_username) {
						$scope.slides[j].author = $scope.professors[i].name;
						continue;
					}
				}
			}
			*/
			// 슬라이드 created를 yyyy-mm-dd 양식으로 잘라준다... 필터에서만 처리해 준다면 필요없을 수도 있다.
			for(var j in $scope.slides) {
				$scope.slides[j].created = $scope.slides[j].created.substr(0, 10);
			}
			

    	};
    	
    			
		$scope.togglePreview = function(courseId) {
			console.log("togglePreview: "+courseId);
			// courseId 에 해당하는 course 의 isExpanded(boolean) 값을 바꾼다.
			var course = getCourseById(courseId,$scope.courses);
			course.isExpanded = course.isExpanded ? false : true;
			
			
				
			// 열었다면 다른모든 아이템의 열려있는 프리뷰는 다 닫는다.
			if( course.isExpanded ===  true) {
				// 열었다면 
				course.previewHeight = 300;
				for(var i in $scope.courses) {
					if(course.id != $scope.courses[i].id) {
						$scope.courses[i].isExpanded = false;
						$scope.courses[i].previewHeight = 0;
					}
				}
			} else {
				// 닫았다면 
				course.previewHeight = 0;
			}
			
		}
		$scope.hidePreview = function(courseId) {
			console.log("hidePreview: "+courseId);
			
			// courseId 에 해당하는 course 의 isExpanded(boolean) 값을 바꾼다.
			var course = getCourseById(courseId,$scope.courses);
			course.isExpanded = false;
			// 닫았으니 
			course.previewHeight = 0;
		}		
		
		initCourses();
		
		function getCourseById(courseId,courseArray) {
			for(var i in courseArray) {
				if(courseArray[i].id === courseId) {
					return courseArray[i];
				}
			}			
		}
		function decodeHtmlNumeric( str ) {
			return str.replace( /&#([0-9]{1,7});/g, function( g, m1 ){
		        return String.fromCharCode( parseInt( m1, 10 ) );
		    }).replace( /&#[xX]([0-9a-fA-F]{1,6});/g, function( g, m1 ){
		        return String.fromCharCode( parseInt( m1, 16 ) );
		    });
		}		
		function initCourses() {
			for(var i in $scope.courses) {
				$scope.courses[i].previewHeight = 0;
			}
		}
		$scope.initCourses();
		
// start by caching some elements and initializing some variables:
    // list of items


/*
    	$scope.initSlides = function() {
    		// DB의 inbox 슬라이드들을 화면에 추가해준다.
			console.log("init & enhence Slides items");
			// 제목과 상세설명의 한글과 특문을 디코딩
			for(var i in $scope.slides) {
				$scope.slides[i].title = decodeHtmlNumeric($scope.slides[i].title);
				if($scope.slides[i].description.length) {
					$scope.slides[i].description = decodeHtmlNumeric($scope.slides[i].description);
				}
				$scope.slides[i].isViewerOn = false;
			}
			// 슬라이드마다 해당하는 코스의 객체와 제목을 달아준다.
			for(var i in $scope.courses) {
				$scope.courses[i].name_ko = decodeHtmlNumeric($scope.courses[i].name_ko);
				// $scope.slides 모든 아이템에 해당하는 course 객체 삽입한다.
				for(var j in $scope.slides) {
					if($scope.slides[j].course_id == $scope.courses[i].id) {
						$scope.slides[j].course = $scope.courses[i];
						$scope.slides[j].courseName = $scope.courses[i].name_ko;
						continue;
					}
				}
			}
			// 슬라이드마다 해당하는 교수님의 이름을 author 키애 넣어준다, 유저네임은 username
			for(var i in $scope.professors) {
				$scope.professors[i].name = decodeHtmlNumeric($scope.professors[i].name);
				for(var j in $scope.slides) {
					if($scope.slides[j].username == $scope.professors[i].slideshare_username) {
						$scope.slides[j].author = $scope.professors[i].name;
						continue;
					}
				}
			}
			// 슬라이드 created를 yyyy-mm-dd 양식으로 잘라준다... 필터에서만 처리해 준다면 필요없을 수도 있다.
			for(var j in $scope.slides) {
				$scope.slides[j].created = $scope.slides[j].created.substr(0, 10);
			}

    	};
    	
		function decodeHtmlNumeric( str ) {
			return str.replace( /&#([0-9]{1,7});/g, function( g, m1 ){
		        return String.fromCharCode( parseInt( m1, 10 ) );
		    }).replace( /&#[xX]([0-9a-fA-F]{1,6});/g, function( g, m1 ){
		        return String.fromCharCode( parseInt( m1, 16 ) );
		    });
		}
		
		$scope.orderProperty = 'courseName'; 		
    	$scope.initSlides();     
*/
	}
]);



lectureCatalogControllers.controller('CoursesManageCtrl', ['$scope', '$http', '$location', '$sce', 'DBService','fetcedCourses','fetcedProfessors',
	function($scope,$http,$location,$sce,DBService,fetcedCourses,fetcedProfessors) {
		console.log('init CoursesManageCtrl');
		DBService.courses = fetcedCourses.data;
		DBService.professors = fetcedProfessors.data;


    	$scope.courses = DBService.courses;
		$scope.professors = DBService.professors;
		console.log($scope.courses);
		
		$scope.orderProperty = 'courseName'; 		
	}
]);

lectureCatalogControllers.controller('CourseInfoModalCtrl', ['$rootScope','$scope', '$http', '$modal', 'DBService','$sce',
	function ($root,$scope, $http, $modal,DBService,$sce) {
	
		$scope.slides = DBService.slides;
		$scope.courses = DBService.courses;
		$scope.professors = DBService.professors;  
		
		console.log('init SlideInfoModalCtrl');
		
		// 슬라이드의 소속 가능성이 있는 강의들을 반환 
		$scope.isCourseAvailable = function(username) {
			console.log("실행은되냐");
			//var username = course.username;
			return function(course) {
				if(course.id === 0) {
					return true;
				}
				var realname = getRealName(username);
				return isProfessorIn(course,realname);
			};
		}
		
		function isProfessorIn(course,professorName) {
			for(var i in course.instructor) {
				if(course.instructor[i] === professorName) {
					return true;
				}	    				    		
			}
			return false;	
		}
	
    	function getRealName(username) {
    		for(var i in $scope.professors) {
	    		if($scope.professors[i].slideshare_username == username) {
		    		return $scope.professors[i].name;
	    		}
    		}
			return false;
    	}

					  
		$scope.open = function (course_id) {			
			var currentItem = DBService.getCourseById(course_id);
			//var availableCourses = [];
			
			//var test = $scope.isCourseAvailable(currentItem.username);
			/*
			var t_idx;
			for(var i in $scope.courses) {
				if(test($scope.courses[i],getRealName(currentItem.username))) {	
					if(currentItem.course_id === $scope.courses[i].id)
						t_idx = i;
					else
						availableCourses.push($scope.courses[i]);
				}
			} 		  
			availableCourses.splice(0, 0, $scope.courses[t_idx]);
			*/
			
			var modalInstance = $modal.open({
				templateUrl: 'partials/courseInfoModalContent.html',
				controller: function ($rootScope,$scope, $modalInstance) {			
					$scope.$on('$locationChangeStart', function(scope, next, current){
						$scope.close();
					});
				
					$scope.isModalOpened = false;
					
					$modalInstance.opened.then(function(result) {
						$scope.isModalOpened = true;
					});
					
					$scope.currentItem = currentItem;
					//$scope.availableCourses = availableCourses;
		
					function decodeSlideTitleText() {
						for(var i in $scope.slides) {
							$scope.slides[i].title = decodeHtmlNumeric($scope.slides[i].title);
							if($scope.slides[i].description.length) {
								$scope.slides[i].description = decodeHtmlNumeric($scope.slides[i].description);
							}
						}
					}    	
				
					function decodeHtmlNumeric( str ) {
						return str.replace( /&#([0-9]{1,7});/g, function( g, m1 ){
					        return String.fromCharCode( parseInt( m1, 10 ) );
					    }).replace( /&#[xX]([0-9a-fA-F]{1,6});/g, function( g, m1 ){
					        return String.fromCharCode( parseInt( m1, 16 ) );
					    });
					}	

					$scope.updateSlideInfo = function () {
						var targetSlide = $scope.currentItem;
						delete targetSlide["$$hashKey"];
						console.log(targetSlide);		    		
			    		
			    		var postOption = {
							url: serverDomain+'api/1/slides/'+targetSlide.id,
							method: "PUT",
							data: JSON.stringify(targetSlide)
						};
							
			    		// 해당슬라이드 blacklist DB에 추가하고 inbox DB 에서 지우는 요청 하고나서 
						$http(postOption).success(function (data, status, headers, config) {
								if(data.status == 200) {
									console.log(id+"인 슬라이드를 잘 수정했습니다.");
									DBService.loadSlides(function(data){
										$scope.slides = data.data;
										console.log("reload slides - success");
										$scope.decodeHangulInbox();
									});										
								}
							}).error(function (data, status, headers, config) {
								alert("에러가 발생하였습니다. 서버가 요청에 제대로 응답하지 않습니다.");
							}
						);  						

				    	$modalInstance.dismiss('cancel');
				    	$modalInstance.result.then(function() {
					    	$scope.isModalOpened = false;
				    	});
					}			
		
					$scope.close = function () {
				    	$modalInstance.dismiss('cancel');
				    	$modalInstance.result.then(function() {
					    	$scope.isModalOpened = false;
				    	});
					}	  
				}
			});
		};
	}
]);
