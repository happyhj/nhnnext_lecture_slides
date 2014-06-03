/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

app.use(express.cookieParser()); // cookie 데이터를 추출
app.use(express.bodyParser()); // post 요청 데이터를 추출
app.use(express.static(path.join(__dirname, 'public'), {maxAge : 365 * 24 * 60 * 60 * 1000}));

http.createServer(app).listen(54000, function(){
  console.log('Express server listening on port ' + 54000);
});

//// NEXT SLIDES
//// HEE JAE 

var nextslides_ctrl = require('./../next_slides/nextslides_controller.js');

app.all(/^\/nextslides$/, function(req, res) { res.redirect('/nextslides/'); });
app.use("/nextslides/", express.static(__dirname + '/../next_slides/webapp/app'));
app.use("/nextslides/partials", express.static(__dirname + '/../next_slides/webapp/app/partials'));
app.use("/nextslides/img", express.static(__dirname + '/../next_slides/webapp/app/img'));

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
app.use(allowCrossDomain);

//// HEE JAE - END

// 크로스도메인요청 허용
app.all('/nextslides/getDB', nextslides_ctrl.get_db);
// 라우트를 수행합니다.
app.get("/nextslides/getDB", nextslides_ctrl.get_db_file);
// 크로스도메인요청 허용
app.all('/nextslides/setDB', nextslides_ctrl.set_db);
// 라우트를 수행합니다.
app.post("/nextslides/setDB", nextslides_ctrl.set_db_file);
/**
* PROFESSORS - CRUD
**/

// DB의 교수님 목록을 가져옵니다.
app.get("/nextslides/api/1/professors", nextslides_ctrl.get_professors);	
// DB에 교수님을 추가합니다.
app.post("/nextslides/api/1/professors", nextslides_ctrl.post_professors);
// DB의 교수님 정보를 가져옵니다.
app.get("/nextslides/api/1/professors/:name", nextslides_ctrl.get_professors_by_name);		
// DB에 교수님을 수정합니다.
app.put("/nextslides/api/1/professors/:name", nextslides_ctrl.put_professors_by_name);	
// DB에서 교수님을 삭제합니다.
app.delete("/nextslides/api/1/professors/:name", nextslides_ctrl.delete_professors_by_name);

/**
* COURSES - CRUD
**/

// DB의 강의 목록을 가져옵니다.
app.get("/nextslides/api/1/courses", nextslides_ctrl.get_courses);	
// DB의 강의를 가져옵니다.
app.get("/nextslides/api/1/courses/:courseId", nextslides_ctrl.get_courses_by_courseId);	
// DB에 강의를 추가합니다.
app.post("/nextslides/api/1/courses", nextslides_ctrl.post_courses);	
// DB에서 강의를 수정합니다.
app.put("/nextslides/api/1/courses/:courseId", nextslides_ctrl.put_courses_by_courseId);	
// DB에서 강의를 삭제합니다.
app.delete("/nextslides/api/1/courses/:courseId", nextslides_ctrl.delete_courses_by_courseId);

/* GET Full slide Info */
app.get("/nextslides/api/1/slideshare", nextslides_ctrl.get_slide_full_info);

/**
* blackListedSlides, slides, inbox 의 CRUD 구현
**/
/* READ ALL */
app.get("/nextslides/api/1/:slideGroupName", nextslides_ctrl.get_slides_by_groupName);	
/* READ ONE */
app.get("/nextslides/api/1/:slideGroupName/:id", nextslides_ctrl.get_slides_by_groupName_and_id);	
/* CREATE */
app.post("/nextslides/api/1/:slideGroupName", nextslides_ctrl.post_slides_by_groupName);
/* UPDATE */
app.put("/nextslides/api/1/:slideGroupName", nextslides_ctrl.put_slides_by_groupName_and_id);
/* DELETE */
app.delete("/nextslides/api/1/:slideGroupName/:id", nextslides_ctrl.delete_slides_by_groupName_and_id);	

