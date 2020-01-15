//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function(req, res) {
  message = "";
  if (req.method == "POST") {
    var post = req.body;
    var name = post.user_name;
    var pass = post.password;
    var fname = post.first_name;
    var lname = post.last_name;
    var mob = post.mob_no;
    var sesa_no1 = post.sesa_no1;

    var sql =
      "INSERT INTO `elunch_users2`(`sesa_no`,`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" +
      sesa_no1 +
      "','" +
      fname +
      "','" +
      lname +
      "','" +
      mob +
      "','" +
      name +
      "','" +
      pass +
      "')";

    var query = db.query(sql, function(err, result) {
      message = "Succesfully! Your account has been created.";
      res.render("signup.ejs", { message: message });
    });
  } else {
    res.render("signup");
  }
};

//-----------------------------------------------login page call------------------------------------------------------
exports.login = function(req, res) {
  var message = "";
  var sess = req.session;

  if (req.method == "POST") {
    var post = req.body;
    var name = post.user_name;
    var pass = post.password;
    var sesa_no1 = post.sesa_no1; //
    console.log("sesa no1= ", sesa_no1);

    var sql =
      "SELECT id, first_name, last_name, user_name FROM `elunch_users2` WHERE `sesa_no`='" +
      sesa_no1 +
      "' and password = '" +
      pass +
      "'";
    db.query(sql, function(err, results) {
      if (results.length) {
        req.session.userId = results[0].id;
        req.session.first_name = results[0].first_name;
        req.session.sesa_no1 = sesa_no1;
        console.log(results[0].id);
        console.log(results[0].first_name);
        console.log("sesa: ", sesa_no1);
        res.redirect("/home/dashboard");
      } else {
        message = "Złe dane logowania (sesa lub hasło)";
        res.render("index.ejs", { message: message });
      }
    });
  } else {
    res.render("index.ejs", { message: message });
  }
};
//-----------------------------------------------dashboard page functionality----------------------------------------------

exports.dashboard = function(req, res, next) {
  var user = req.session.user,
    userId = req.session.userId,
    fname = req.session.first_name;

  console.log("userID= " + userId);
  console.log("first_name= " + req.session.first_name);

  if (userId == null) {
    res.redirect("/login");
    return;
  }

  var sql = "SELECT * FROM `elunch_users2` WHERE `id`='" + userId + "'";

  db.query(sql, function(err, results) {
    res.render("dashboard.ejs", { fname });
    console.log("user= " + fname);
  });
};
//------------------------------------logout functionality----------------------------------------------
exports.logout = function(req, res) {
  req.session.destroy(function(err) {
    res.redirect("/login");
  });
};
//--------------------------------render user details after login--------------------------------
exports.profile = function(req, res) {
  var userId = req.session.userId;
  if (userId == null) {
    res.redirect("/login");
    return;
  }

  var sql = "SELECT * FROM `elunch_users2` WHERE `id`='" + userId + "'";
  db.query(sql, function(err, result) {
    res.render("profile.ejs", { result });
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

exports.new_order = function(req, res, next) {
  var user = req.session.user,
    userId = req.session.userId,
    fname = req.session.first_name,
    sesa_no1 = req.session.sesa_no1,
    menu_json,
    menu_json2,
    my_date,
    my_orders, order_no;
    var order_name2=req.session.order_name2_session;
    var menu_price2=req.session.menu_price2_session;

  console.log("userID= " + userId);
  console.log("first_name= " + req.session.first_name);
  console.log("sesa_no1= " + sesa_no1);
  console.log("Method: " + req.method);
  var mysupplier_name = req.query.ID;
  mysupplier_name = "Mucha";
  console.log("myID: " + mysupplier_name);
  var my_date = "2020-01-12"; //req.query.my_date;
  console.log("my_date: " + my_date);

  if (userId == null) {
    res.redirect("/login");
    return;
  }

  if (req.method == "POST") {
    console.log(
      "post: ",
      req.body.sesa_no1,
      " ",
      req.body.supplier,
      " ",
      req.body.order_date,
      " ",
      req.body.order_no, "req.session.order_name2",
      req.session.order_name2, req.session.menu_price2, "req.session.menu_price2"
    );
    var sesa_no2 = req.body.sesa_no1;
    var supplier = req.body.supplier;
    var order_date = req.body.order_date;
    var order_no5 = req.body.order_no;

    //base order_no, get from menu order_name and order_price
    var sql6 =
      "SELECT * FROM `elunch_menu2` WHERE `supplier_name`='" +
      supplier +
      "' and menu_no = '" +
      order_no5 +
      "'";

    db.query(sql6, function(err, results) {
      if (results.length) {
        console.log("error: ",err);
        req.session.order_name2=results[0].menu_desctription;
        console.log("session.order_name2: ", req.session.order_name2);
       req.session.menu_price2=results[0].menu_price;
       // return order_name2, menu_price2;
        console.log("session.order_price2: ", req.session.menu_price2);
      } else {
        message = "problem z pobraniem danych z bazy menu przed zapisem do bazy order2";
        res.render("index.ejs", { message: message });
      }
    });
    console.log("\n po if order_price2: ", req.session.menu_price2 ," \n order_name2: ",req.session.order_name2);
    // put order to DB
    var sql5 =
      "INSERT INTO `elunch_orders2`(`Id_sesa_no`,`order_date`,`order_supplier_name`,`order_no`,`order_name`, `order_price`) VALUES ('" +
      sesa_no2 +
      "','" +
      order_date +
      "','" +
      supplier +
      "','" +
      order_no5 +
      "','" +
      req.session.order_name2 +
      "','" +
      req.session.menu_price2 +
      "')";

    db.query(sql5, function(err, results) {
      if (results.length) {
        console.log("OK ");
        // res.render("new_order.ejs", { 
        //   fname,
        //   menu_json,
        //   menu_json2,
        //   sesa_no1,
        //   my_orders});
      } else {
        console.log("NOK ");
        // message_NOK = "Błąd w dodawaniu do bazy danych";
        // res.render("new_order.ejs", { 
        //   fname,
        //   menu_json,
        //   menu_json2,
        //   sesa_no1,
        //   my_orders});
      }
    });
  }
  // Display current orders
  var sql1 =
    "SELECT * FROM `elunch_orders2` WHERE `order_supplier_name`='" +
    mysupplier_name +
    "'";

  db.query(sql1, function(err, results) {
    my_orders = JSON.stringify(results);
    console.log("my_orders: ", my_orders);
  });

  // display menu
  // var sql="SELECT * FROM `elunch_menu2` WHERE `id`='"+userId+"'";
  var sql3 =
    "SELECT * FROM `elunch_menu2` WHERE `supplier_name`='" +
    mysupplier_name +
    "'";
  // var sql3 = "SELECT * FROM `elunch_menu2` WHERE 1 ";

  db.query(sql3, function(err, results) {
    menu_json = JSON.stringify(results);
    // menu_json2 = JSON.stringify(results);
    console.log("menu_json: ", menu_json);
    //res.render("new_order.ejs", { fname, menu_json });
  });
  // }
  // if (mysupplier_name="Opoka"){
  //   // display menu
  //   // var sql="SELECT * FROM `elunch_menu2` WHERE `id`='"+userId+"'";
  mysupplier_name = "Opoka";
  var sql4 =
    "SELECT * FROM `elunch_menu2` WHERE `supplier_name`='" +
    mysupplier_name +
    "'";
  //   // var sql3 = "SELECT * FROM `elunch_menu2` WHERE 1 ";

  db.query(sql4, function(err, results) {
    menu_json2 = JSON.stringify(results);
    console.log("menu_json2: ", menu_json2);
    res.render("new_order.ejs", {
      fname,
      menu_json,
      menu_json2,
      sesa_no1,
      my_orders
    });
  });
  // }
  // res.render("new_order.ejs", { fname,  menu_json });
  //db.destroy();
};
//-----------------------------------------------new_user page functionality----------------------------------------------

exports.table = function(req, res, next) {
  var user = req.session.user,
    userId = req.session.userId,
    fname = req.session.first_name;
  sesa_no1 = req.session.sesa_no1;

  console.log("userID= " + userId);
  console.log("first_name= " + req.session.first_name);
  console.log("sesa_n1o= " + sesa_no1);

  if (userId == null) {
    res.redirect("/login");
    return;
  }

  var sql = "SELECT * FROM `elunch_users2` WHERE `id`='" + userId + "'";
  var dataSet = [
    [
      "Tiger Nixon",
      "System Architect",
      "Edinburgh",
      "5421",
      "2011/04/25",
      "$320,800"
    ]
  ];
  var myjson, myjson;

  db.query(sql, function(err, results1) {
    //res.render('new_order.ejs', {fname,dataSet});
    myjson1 = JSON.stringify(results1);

    console.log("tabela_users: ", myjson1);
  });

  var id_order2 = 1;
  var sql2 = "SELECT * FROM `elunch_orders2` WHERE 1"; //`id`='"+id_order2+"'
  db.query(sql2, function(err, results) {
    // res.send(JSON.stringify({key:"value"}));
    myjson = JSON.stringify(results);

    console.log("tabela_zamowien ", myjson);
    res.render("table.ejs", { myjson1, myjson });
  });
};
