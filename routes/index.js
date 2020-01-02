/*
* GET home page.
*/
 
exports.index = function(req, res){
    var message = 'witaj, aby się zalogować wpisz email i hasło: ';
  res.render('index',{message: message});
 
};
