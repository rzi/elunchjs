/*
* GET home page.
*/
 
exports.index = function(req, res){
    var message = 'Witaj, aby się zalogować wpisz część numeryczną sesa i hasło: ';
  res.render('index',{message: message});
 
};
