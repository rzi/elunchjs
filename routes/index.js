/*
* GET home page.
*/
 
exports.index = function(req, res){
    var message = 'witaj!: ';
  res.render('index',{message: message});
 
};
