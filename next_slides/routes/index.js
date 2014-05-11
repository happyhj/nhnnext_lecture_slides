
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.hellojisu = function(req, res){
  res.render('hello', { title: 'Hello , jisu' });
};

exports.urisunsu = function(db) {
    return function(req, res) {
        var collection = db.get('matchSchedule'); //collection name
        collection.find({},{},function(e,docs){
                console.log("docs - > " + docs);

                docs.sort(utility.datesort);

                res.render('urisunsu', {
                    "matchList" : docs
                    });
                });
    };
}

var utility = {
    datesort : function(d1,d2) {
                    if (d1.matchDate === d2.matchDate) return 0;
                    return (d1.matchDate > d2.matchDate) ? 1 : -1;
               }
}
