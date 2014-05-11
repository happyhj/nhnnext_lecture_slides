/*
 * GET users listing.
 */

exports.res = function(req, res){
  res.jsonp({"title" : "jisu"});

  //normal json response
  //res.json([{'title':'node'}]);
};
