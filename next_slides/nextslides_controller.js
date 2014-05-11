var fs = require("fs");
// API 키를 선언합니다.
var secretKey = "4WMOMSjc";
var apikey = "KYnh1fWH";
var https = require('https');
var crypto = require('crypto');
var xml2json = require("node-xml2json");
/*
 * GET users listing.
 */
var db_file_path = "../next_slides/lectureslideDB.json";
exports.get_db = function(req, res, next) {  
	res.header("Access-Control-Allow-Origin", "*");  
	res.header("Access-Control-Allow-Headers", "X-Requested-With");  
	next(); 
};

exports.get_db_file = function(request,response,next) {
	fs.readFile(db_file_path,'utf8',function(error,data) {				
		response.send(data);	
	});
}

exports.set_db = function(req, res, next) {  
	res.header("Access-Control-Allow-Origin", "*");  
	res.header("Access-Control-Allow-Headers", "X-Requested-With");  
	next(); 
};

exports.set_db_file = function(request,response,next) {
	var dbJsonStr = request.param("dbjson");
	
	fs.writeFile(db_file_path,dbJsonStr,function(error) {
		if (error) throw error;
		console.log('It\'s saved!');
	});
}


exports.get_professors = function(request,response,next) {
	var repository = new Repository('professors','name');
	repository.find({
		"callback":	function(result) {
			response.send(JSON.stringify(result));			
		}
	});
}

exports.post_professors = function(request,response,next) {
	// 인자 유효성검사 해야됨 여기서 
	var repository = new Repository('professors','name');
	repository.add({
		"item" : request.body,
		"callback":	function(result) {
			response.send(JSON.stringify(result));			
		}
	});
}

exports.get_professors_by_name = function(request,response,next) {
	var name = request.param("name");
	var repository = new Repository('professors','name');
	repository.find({
		"query": name,
		"callback":	function(result) {
			response.send(JSON.stringify(result));			
		}
	});
};

exports.put_professors_by_name = function(request,response,next) {
	var name = request.param("name");
	var professor = request.body;
	professor["name"] = name;
	var repository = new Repository('professors','name');
	repository.update({
		"item" : professor,
		"callback":	function(result) {
			response.send(JSON.stringify(result));			
		}
	});
};

exports.delete_professors_by_name = function(request,response,next) {
	var name = request.param("name");
	var repository = new Repository('professors','name');
	repository.remove({
		"query": name,
		"callback":	function(result) {
			response.send(JSON.stringify(result));			
		}
	});
}

exports.get_courses = function(request,response,next) {
	var repository = new Repository('courses','id');
	repository.find({
		"callback":	function(result) {
			response.send(JSON.stringify(result));			
		}
	});
}



exports.get_courses_by_courseId = function(request,response,next) {
	var courseId = request.param("courseId");
	var repository = new Repository('courses','id');
	repository.find({
		"query": courseId,
		"callback":	function(result) {
			response.send(JSON.stringify(result));			
		}
	});
}

exports.post_courses = function(request,response,next) {
	// 인자 유효성검사 해야됨 여기서 
	var courseObj = request.body;
	courseObj["id"] = parseInt(courseObj.id);
	var repository = new Repository('courses','id');
	repository.add({
		"item" : courseObj,
		"callback":	function(result) {
			response.send(JSON.stringify(result));			
		}
	});
}

exports.put_courses_by_courseId = function(request,response,next) {	
	var courseId = request.param("courseId");
	var courseObj = request.body;
	courseObj["id"] = parseInt(courseId);
	var repository = new Repository('courses','id');
	repository.update({
		"item" : courseObj,
		"callback":	function(result) {
			response.send(JSON.stringify(result));			
		}
	});
}

exports.delete_courses_by_courseId = function(request,response,next) {
	var courseId = parseInt(request.param("courseId"));
	var repository = new Repository('courses','id');
	repository.remove({
		"query": courseId,
		"callback":	function(result) {
			response.send(JSON.stringify(result));			
		}
	});
}

exports.get_slides_by_groupName = function(request,response,next) {
	var slideGroupName = request.param("slideGroupName");
	if(slideGroupName === "updateIndox") {
		getInboxHandler(request,response,function(result){
			response.send(JSON.stringify(result));
		});	
	} else {
		var repository = new Repository(slideGroupName,'id');
		repository.find({
			"callback":	function(result) {
				response.send(JSON.stringify(result));			
			}
		});	
	}
}

exports.get_slides_by_groupName_and_id = function(request,response,next) {
	var slideGroupName = request.param("slideGroupName");
	console.log(slideGroupName);
	if(slideGroupName == "slideshareSlides") {
		getSlideshareSlidesByIdHandler(request,response,next);
	} else {
		console.log("요기?");	
		var id = request.param("id");
		var repository = new Repository(slideGroupName,'id');
		repository.find({
			"query": id,
			"callback":	function(result) {
				response.send(JSON.stringify(result));			
			}
		});
	}
}


exports.post_slides_by_groupName = function(request,response,next) {
	var slideGroupName = request.param("slideGroupName");
	var slideObj = request.body;
	slideObj["id"] = parseInt(slideObj["id"]);
	var repository = new Repository(slideGroupName,'id');
	repository.add({
		"item" : slideObj,
		"callback":	function(result) {
			response.send(JSON.stringify(result));			
		}
	});
}

exports.put_slides_by_groupName_and_id = function(request,response,next) {
	var slideGroupName = request.param("slideGroupName");
	var slideObj = request.body ;
	console.log(slideObj);
	//slideObj["id"] = parseInt(slideObj["id"]);
	var repository = new Repository(slideGroupName,'id');
	repository.update({
		"item" : slideObj,
		"callback":	function(result) {
			response.send(JSON.stringify(result));			
		}
	});
}

exports.delete_slides_by_groupName_and_id = function(request,response,next) {
	var slideGroupName = request.param("slideGroupName");
	var id = parseInt(request.param("id"));
	var repository = new Repository(slideGroupName,'id');
	repository.remove({
		"query": id,
		"callback":	function(result) {
			response.send(JSON.stringify(result));			
		}
	});
}

// 슬라이드 쉐어에서 해당 교수님의 모든 슬라이드를 가져옵니다.
//app.get("/api/1/slideshareSlides/:slideshare_id",getSlideshareSlidesById);
function getSlideshareSlidesByIdHandler(request,response,next) {
	var slideshare_id = request.param("id");
	getSlideshareSlidesById(slideshare_id,function(result){
		response.send(JSON.stringify(result));
	});	
}

// 슬라이드 쉐어의 모든 교수님의 모든 슬라이드를 가져옵니다.
function getAllSlideshareSlidesHandler(request,response,next) {
	var professors = [];	
	var repository = new Repository('professors','name');
	repository.find({
		"callback":	function(result) {
			if(result.status == 200) {
				professors = result.data;	
				var numberOfProfessors = professors.length;
				var responseCount = 0;
				var slides = [];
				for( var i in professors) {		
					console.log(professors[i].slideshare_username);
					getSlideshareSlidesById(professors[i].slideshare_username,function(result){			
						slides = slides.concat(result.user.slideshow);
						
						// 문제가 발생하는 description 이라는 항목을 삭제
						//delete slides["description"];

						responseCount++;
						if(responseCount === numberOfProfessors) {
							next({"status":200,"data":slides});
						}
					});	
				}	
			}			
		}
	});
}

function getInboxHandler(request,response,next) {
	// inbox, course, blacklist 의 모든 슬라이드를 확보 후 "inbox","slides","blackListedSlides"
	getAllSlidesInDB(function(slides){
		console.log("DB의 모든 슬라이드 확보 완료");
		console.log(slides.data.length);
		getAllSlideshareSlidesHandler(request,response,function(result){
			console.log("SLIDESHARE 의 모든 슬라이드 확보 완료");
			console.log(result.data.length);
			
					//response.send(JSON.stringify(json));
			//  json 체형 줄이기 
			var slim_json = [];
			for(var i in result.data) {
				var slide = {};
				slide.id = result.data[i].id;
				slide.title = result.data[i].title;
				slide.description = String(result.data[i].description);
				slide.created = result.data[i].created;
				slide.updated = result.data[i].updated;
				slide.username = result.data[i].username;
				slide.thumbnailurl = result.data[i].thumbnailurl;
				slim_json.push(slide);
			}
			result.data = slim_json;
						
			var allSlideshareSlides = result.data;
			var removeQueue = [];
			// inbox, course, blacklist 에 포함되어있는게 있으면 결과에서 제거하고
			var allDBSlides = slides.data;
			
			for( var i in allSlideshareSlides ) {				
				for( var j in allDBSlides ) {
					if(allSlideshareSlides[i].id == allDBSlides[j].id) {
						// 동일한 id의 슬라이드가 기존 DB에 존재하면 슬라이드쉐어 배열에서 제거
						removeQueue.push(i);
					}
				} 						
			} 
			var repository = new Repository('inbox','id');
			
			if(removeQueue.length > 0) {
				console.log("중복되는 슬라이드가 있습니다");
				console.log(removeQueue);
				// 끝에서 부터 제거
				var numOfDuplication = removeQueue.length;
				for(var k = removeQueue.length - 1;k>=0;k--){
					if (k > -1) {
						console.log("removing "+removeQueue[k]+"th item");
					    allSlideshareSlides.splice(removeQueue[k], 1);
					    				console.log("allSlideshareSlides.length :" +allSlideshareSlides.length);

					}				
				}
			}	
			
			// 여러개의 아이템 추가를 재귀로 구현
			if(allSlideshareSlides.length > 0) {
				var addCallbackCounter = 0;						
				repository.add({
					"item": allSlideshareSlides[addCallbackCounter],
					"callback":	inboxAddItemCallback
				});				
				function inboxAddItemCallback(result) {
					addCallbackCounter++;
					if(addCallbackCounter == allSlideshareSlides.length) {
						console.log("다 추가했네?");
						repository.find({
							"callback":	function(result) {
								next(result);
							}
						});
						return;				
					}
					repository.add({
						"item": allSlideshareSlides[(addCallbackCounter-1)],
						"callback":	inboxAddItemCallback
					});
				}
			} else {
				console.log("더할 게 없다");
				// inbox DB의 모든 슬라이드를 반환		
				repository.find({
					"callback":	function(result) {
						//console.log("all inbox");					
						//console.log(result);	
						next(result);
					}
				});						
			}
		
		});
	})
}

exports.get_slide_full_info = function(request,response,next) {
	console.log("헉 요청들어옴");
	var slideId = request.param("slideId");
	var apikeyEncoded = getApiKeyUrlEncoded(secretKey, apikey);	
	
	function callback(result) {
		console.log("콜백이 실행 된당");
		response.send(JSON.stringify(result));		
	}	
									           	
	https.request({
	  host: 'www.slideshare.net',
	  path: '/api/2/get_slideshow?slideshow_id='+slideId+apikeyEncoded,
	  headers: {'Content-Type': 'text/html; charset=utf-8'}
	}, function(ApiResponse) {
	  var xmlStr = '';
	  //another chunk of data has been recieved, so append it to `xmlStr`
	  ApiResponse.on('data', function (chunk) {
	    xmlStr += chunk;
	  });
	  //the whole response has been recieved, so we just print it out here
	  ApiResponse.on('end', function () {
		var json = xml2json.parser(xmlStr);
		callback(json);	 
	  });
	}).end();
	
	function getApiKeyUrlEncoded(secretKey,apikey) {
		var timeStamp = Math.floor(new Date().getTime()/1000);
		var hashParam = secretKey + timeStamp;		
		var hash = crypto.createHash('sha1').update(hashParam.toString()).digest('hex');
		var apiKeyUrlEncode = "&api_key="+apikey+"&hash="+hash+"&ts="+timeStamp;
		return apiKeyUrlEncode;
	}		
}

function getSlideshareSlidesById(id, callback) {
	var apikeyEncoded = getApiKeyUrlEncoded(secretKey, apikey);										           	
	https.request({
	  host: 'www.slideshare.net',
	  path: '/api/2/get_slideshows_by_user?username_for='+id+apikeyEncoded,
	  headers: {'Content-Type': 'text/html; charset=utf-8'}
	}, function(ApiResponse) {
	  var xmlStr = '';
	  //another chunk of data has been recieved, so append it to `xmlStr`
	  ApiResponse.on('data', function (chunk) {
	    xmlStr += chunk;
	  });
	  //the whole response has been recieved, so we just print it out here
	  ApiResponse.on('end', function () {
		var json = xml2json.parser(xmlStr);
		callback(json);	 
	  });
	}).end();
	
	function getApiKeyUrlEncoded(secretKey,apikey) {
		var timeStamp = Math.floor(new Date().getTime()/1000);
		var hashParam = secretKey + timeStamp;		
		var hash = crypto.createHash('sha1').update(hashParam.toString()).digest('hex');
		var apiKeyUrlEncode = "&api_key="+apikey+"&hash="+hash+"&ts="+timeStamp;
		return apiKeyUrlEncode;
	}		
}

// inbox, course, blacklist 의 모든 슬라이드를 모아서 반환 
function getAllSlidesInDB (callback) {
	// inbox, course, blacklist 의 모든 슬라이드를 확보 후 "inbox","slides","blackListedSlides"
	var resultCount = 0;
	var slides = [];
	var inboxRepository = new Repository('inbox','id');
	inboxRepository.find({
		"callback":	function(result) {
			slides = slides.concat(result.data);
			resultCount++;
			if(resultCount == 3) {
				callback({"status":200,"message":"DB(inbox,slides,blackListedSlides)의 모든 슬라이드를 읽어왔습니다","data" :slides});
			}
		}
	});	
	var slidesRepository = new Repository('slides','id');
	slidesRepository.find({
		"callback":	function(result) {
			slides = slides.concat(result.data);
			resultCount++;
			if(resultCount == 3) {
				callback({"status":200,"message":"DB(inbox,slides,blackListedSlides)의 모든 슬라이드를 읽어왔습니다","data" :slides});
			}
		}
	});	
	var blackListedSlidesRepository = new Repository('blackListedSlides','id');
	blackListedSlidesRepository.find({
		"callback":	function(result) {
			slides = slides.concat(result.data);
			resultCount++;
			if(resultCount == 3) {
				callback({"status":200,"message":"DB(inbox,slides,blackListedSlides)의 모든 슬라이드를 읽어왔습니다","data" :slides});
			}		
		}
	});	
}

// 레포지토리 
var Repository = function(tableName,primaryKeyColumnStr) {
	// 생성 시에 파일에서 읽어와서 초기화
	this.tableName = tableName;
	this.primaryKey = primaryKeyColumnStr;
};
	
Repository.prototype = {
	add : function(option) {
		var item = option.item;
		var key = item[this.primaryKey];
		var callback = option.callback;	
		
		fs.readFile(db_file_path,'utf8',(function(error,data) {				
			var json = JSON.parse(data);
			var list = json[this.tableName];
			if(!list) {
				callback({"status":400,"message":"추가하려 했지만, "+this.tableName+"이라는 항목이 없네요."});
				return;				
			}
			var isUnique = true;
			for( var i in list) {
				if(list[i][this.primaryKey] == key) {
					isUnique = false;
					callback({"status":400,"message":"중복된 "+this.tableName+"의 키값이 존재하므로 추가할 수 없습니다","data":json[this.tableName]});		
					return;
				}
			}	
			if(isUnique === true) {
				json[this.tableName].push(item);
				fs.writeFile(db_file_path, JSON.stringify(json), (function(err) {
					callback({"status":200,"message": this.tableName+"을 추가 성공","data":json[this.tableName]});			
					return;
				}).bind(this));							
			}			
		}).bind(this));	
	},
	find : function(option) {
		var query = option.query;
		var callback = option.callback;		
		fs.readFile(db_file_path,'utf8',(function(error,data) {	
			console.log("find 요청을 시도하는 테이블이름: " + this.tableName);
			var json = JSON.parse(data);
			var list = json[this.tableName];
			if(!list) {
				callback({"status":400,"message":"찾아보려 했지만, "+this.tableName+"이라는 항목이 없네요."});
				return;				
			}
			for( var i in list) {
				if(list[i][this.primaryKey] == query) {
					if(typeof callback == 'function') {
						callback({"status":200,"data":list[i]});
						return;
					}			
				}
			}
			if(!query) { // 쿼리가 없으면 조건이 없는것이므로 모든 값을 반납
				if(typeof callback == 'function') {
					callback({"status":200,"data":list});
					return;
				}
			} else {				
				if(typeof callback == 'function') {
					callback({"status":400,"message":"찾아보려 했지만, 그런 "+this.tableName+"이 없네요.","data":json.list});
					return;
				}
			}
		}).bind(this));		
	},
	update : function(option) {
		var query = option.item[this.primaryKey];
		var item = option.item;
		var callback = option.callback;	
		fs.readFile(db_file_path,'utf8',(function(error,data) {	
			console.log("update 요청을 시도하는 테이블이름: " + this.tableName);
			var json = JSON.parse(data);
			var list = json[this.tableName];
			var isTargetExist = false;

			if(!list) {
				callback({"status":400,"message":"수정하려 했지만, "+this.tableName+"이라는 항목이 없네요."});
				return;				
			}
			for( var i in list) {
				if(list[i][this.primaryKey] == query) {
					isTargetExist = true;
					// 아이템을 그대로 덮어씌운다.
					json[this.tableName][i] = item;
					fs.writeFile(db_file_path, JSON.stringify(json), (function(err) {
						callback({"status":200,"message": this.tableName+"에서 "+query+"을 수정 성공","data":json[this.tableName]});			
						return;
					}).bind(this));		
				}
			}		
			if(!isTargetExist) {
				if(!query) { // 쿼리가 없으면 조건이 없는것이므로 모든 값을 반납
					callback({"status":400,"message":"필요한 인자가 제공되지 않아서 "+this.tableName+"를 수정할 수 없습니다.","data":json.list});
				} else {				
					callback({"status":400,"message":"수정하려 했지만, 그런 "+this.tableName+"가 없네요","data":json.list});
				}
			}
		}).bind(this));		
	},
	remove : function(option) {
		var query = option.query;
		var callback = option.callback;			
		fs.readFile(db_file_path,'utf8',(function(error,data) {				
			var json = JSON.parse(data);
			var list = json[this.tableName];
			var isTargetExist = false;
			if(!list) {
				callback({"status":400,"message":"삭제하려 했지만, "+this.tableName+"이라는 항목이 없네요."});
				return;				
			}
			for(var i in list) {	
			console.log(this.primaryKey);		
				if(list[i][this.primaryKey] == query) {
					console.log("hello");
					isTargetExist = true;
					json[this.tableName].splice(i,1);
					fs.writeFile(db_file_path, JSON.stringify(json), (function(err) {
						callback({"status":200,"message": query+" "+this.tableName+"를 삭제하였습니다.","data":json[this.tableName]});
						return;			
					}).bind(this));		
				}
			}
			if(!isTargetExist) {
				if(!query) { // 쿼리가 없으면 조건이 없는것이므로 모든 값을 반납
					callback({"status":400,"message":"필요한 인자가 제공되지 않아서 "+this.tableName+"를 삭제할 수 없습니다.","data":json.list});
				} else {				
					callback({"status":400,"message":"삭제하려 했지만, 그런 "+this.tableName+"가 없네요","data":json.list});
				}
			}
		}).bind(this));		
	}
};

