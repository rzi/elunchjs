
//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
      var fname= post.first_name;
      var lname= post.last_name;
      var mob= post.mob_no;
      var sesa_no = post.sesa_no;

      var sql = "INSERT INTO `elunch_users2`(`sesa_no`,`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" + sesa_no + "','" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "')";

      var query = db.query(sql, function(err, result) {

         message = "Succesfully! Your account has been created.";
         res.render('signup.ejs',{message: message});
      });

   } else {
      res.render('signup');
   }
};
 
//-----------------------------------------------login page call------------------------------------------------------
exports.login = function(req, res){
   var message = '';
   var sess = req.session; 

   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
      var sesa_no =post.sesa_no;
      console.log(sesa_no);
     
      var sql="SELECT id, first_name, last_name, user_name FROM `elunch_users2` WHERE `sesa_no`='"+sesa_no+"' and password = '"+pass+"'";                           
      db.query(sql, function(err, results){      
         if(results.length){
            req.session.userId = results[0].id;
            req.session.first_name = results[0].first_name;
            req.session.sesa_no = results[0].sesa_no;
            console.log(results[0].id);
            console.log(results[0].first_name);
            console.log("sesa: ", results[0].sesa_no," tu jest błąd -> do sprawdzeia dlaczego jest undiefined");
            res.redirect('/home/dashboard');
         }
         else{
            message = 'Złe dane logowania (sesa lub hasło)';
            res.render('index.ejs',{message: message});
         }
                 
      });
   } else {
      res.render('index.ejs',{message: message});
   }
           
};
//-----------------------------------------------dashboard page functionality----------------------------------------------
           
exports.dashboard = function(req, res, next){
           
   var user =  req.session.user,
   userId = req.session.userId,
   fname= req.session.first_name;

   console.log('userID= '+userId);
   console.log('first_name= '+req.session.first_name);
   
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `elunch_users2` WHERE `id`='"+userId+"'";

   db.query(sql, function(err, results){
      res.render('dashboard.ejs', {fname}); 
      console.log('user= ' + fname)  ;
   });       
};
//------------------------------------logout functionality----------------------------------------------
exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
};
//--------------------------------render user details after login--------------------------------
exports.profile = function(req, res){

   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `elunch_users2` WHERE `id`='"+userId+"'";          
   db.query(sql, function(err, result){  
      res.render('profile.ejs',{result});
   });
};
//---------------------------------edit users details after login----------------------------------
// exports.editprofile=function(req,res){
//    var userId = req.session.userId;
//    if(userId == null){
//       res.redirect("/login");
//       return;
//    }

//    var sql="SELECT * FROM `users2` WHERE `id`='"+userId+"'";
//    db.query(sql, function(err, results){
//       res.render('edit_profile.ejs',{data:results});
//    });
// };
//-----------------------------------------------new_user page functionality----------------------------------------------
           
exports.new_order = function(req, res, next){
           
   var user =  req.session.user,
   userId = req.session.userId,
   fname= req.session.first_name;
   sesa_no=req.session.sesa_no;

   console.log('userID= '+userId);
   console.log('first_name= '+req.session.first_name);
   console.log('sesa_no= '+sesa_no);

   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `elunch_users2` WHERE `id`='"+userId+"'";
   var dataSet = [
      [ "Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800" ]
  ];
   db.query(sql, function(err, results){
      res.render('new_order.ejs', {fname}); 
       console.log('result: ' + results.length)  ;
   });   
 
};