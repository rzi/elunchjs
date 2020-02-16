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
    var myDateCookies, mySupplierCookies;
    db.query(sql, function(err, results) {
      if (results.length) {
        req.session.userId = results[0].id;
        req.session.first_name = results[0].first_name;
        req.session.sesa_no1 = sesa_no1;
        req.session.myDateCookies = new Date();
        req.session.mySupplierCookies = "Mucha";
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

  // console.log("userID= " + userId);
  // console.log("first_name= " + req.session.first_name);

  if (userId == null) {
    res.redirect("/login");
    return;
  }

  var sql = "SELECT * FROM `elunch_users2` WHERE `id`='" + userId + "'";
  db.query(sql, function(err, results) {
    res.render("dashboard.ejs", { fname });
    // console.log("user= " + fname);
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
    mydate,
    my_orders,
    order_no,
    supplier;
  var sesa_no2 = req.body.sesa_no1;
  var supplier_post = req.body.supplier;
  var order_date = req.body.order_date;
  var order_no5 = req.body.order_no;
  var menu_desctription, menu_price;
  var supplier = req.query.supplier;
  var order_no = req.body.order_no;

  if (userId == null) {
    res.redirect("/login");
    return;
  } //redirect if not longin

  if (req.method == "DELETE") {
    var delete_id = req.body.delete_id;
    console.log("delete: ", delete_id);
    var sql7 = "DELETE FROM `elunch_orders2` WHERE `id` ='" + delete_id + "'";
    db.query(sql7, function(err, results) {
      console.log("deleted one row");
    });
  } //delete

  if (req.method == "POST") {
    console.log("Method: " + req.method);
    var supplier = req.body.supplier;
    var order_no = req.body.order_no;
    console.log(
      "post: ",
      sesa_no1,
      " ",
      supplier,
      " ",
      order_date,
      " ",
      "Numer dania ",
      order_no,
      " "
    );
    //base order_no, get from menu order_name and order_price
    var sql6 =
      "SELECT * FROM `elunch_menu2` WHERE `supplier_name`='" +
      supplier +
      "' and menu_no = '" +
      order_no +
      "'";
    db.query(sql6, function(err, results) {
      if (results.length) {
        menu_desctription = results[0].menu_desctription;
        console.log("menu_desctription: ", menu_desctription);
        menu_price = results[0].menu_price;
        //return menu_desctription;
        console.log("menu_price: ", menu_price);
      } else {
        message =
          "problem z pobraniem danych z bazy menu przed zapisem do bazy order2";
        res.render("index.ejs", { message: message });
      }
      console.log("order_date: ", order_date);
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
        menu_desctription +
        "','" +
        menu_price +
        "')";
      console.log("SQL: ", sql5);
      db.query(sql5, function(err, results) {
        console.log("Inerted record to DB");
      });
      console.log("order_date: " + order_date);
    });
  } else if (req.method == "GET") {
    var mydate = req.query.mydate; //tylko z GET
    console.log("Method: " + req.method);
    console.log("mydate from GET req query: " + mydate);
    if (mydate == undefined) {
      now = new Date();
      day = ("0" + now.getDate()).slice(-2);
      month = ("0" + (now.getMonth() + 1)).slice(-2);
      today = now.getFullYear() + "-" + month + "-" + day;
      console.log("Date if mydate = undefined so, mydate = today: " + today);
      mydate = today;
    }
    console.log("mydate: " + mydate);
  }

  if (req.method == "GET") {
    if (!mydate) {
      mydate = today;
      console.log("w if ");
    }
    console.log("w if mydate: " + mydate);
  } else if (req.method == "POST") {
    mydate = order_date;
  } else if (req.method == "DELETE") {
    mydate = today;
  }

  // display current orders
  var sql1 =
    "SELECT * FROM `elunch_orders2` WHERE `order_date`='" +
    mydate +
    "' ORDER BY id DESC";
  console.log("sql1: " + sql1);
  db.query(sql1, function(err, results) {
    my_orders = JSON.stringify(results);
    console.log("my_orders: ", my_orders);
  });

  // display menu
  mysupplier_name = "Mucha";
  var sql3 =
    "SELECT * FROM `elunch_menu2` WHERE `supplier_name`='" +
    mysupplier_name +
    "'";
  db.query(sql3, function(err, results) {
    menu_json = JSON.stringify(results);
    console.log("menu_json: ", menu_json);
  });
  mysupplier_name = "Opoka";
  var sql4 =
    "SELECT * FROM `elunch_menu2` WHERE `supplier_name`='" +
    mysupplier_name +
    "'";
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
};

//2
exports.new_order2 = function(req, res, next) {
  if (req.method == "POST") {
    var mydate = req.body.my_date;
    var mysupplier = req.body.my_supplier;
    var sesa_no1 = req.session.sesa_no1;
    var fname = req.session.first_name;
    console.log("sesa_no1: " + sesa_no1);

    // display menu
    mysupplier_name = mysupplier;
    var sql3 = "SELECT * FROM `elunch_menu2` WHERE `supplier_name`='" + mysupplier_name + "'";
    console.log("sql3: " + sql3);
    db.query(sql3, function(err, results) {
      menu_json = JSON.stringify(results);
      console.log("menu_json: ", menu_json);
    });

    // display current orders
    // var sql1 =
    //   "SELECT * FROM `elunch_orders2` WHERE `order_date`='" +
    //   mydate +
    //   "' ORDER BY id DESC";
      var sql1 =
      "SELECT * FROM `elunch_orders2` WHERE `order_date`='" +
      mydate +
      "' AND `Id_sesa_no`='"+
      sesa_no1 +
      "' ORDER BY id DESC";
    console.log("sql1: " + sql1);

    db.query(sql1, function(err, results) {
      //console.log("results: " + results);
      orders_json = JSON.stringify(results);
      console.log("orders_json: ", orders_json);
      res.json({ table_data: results, table_supplier: JSON.parse(menu_json), fname: fname , sesa_no1: sesa_no1});
    });
  } else if (req.method == "GET") {
    res.render("new_order2.ejs");
  } else if (req.method == "PUT") {
    var supplier = req.body.supplier;
    var order_no = req.body.order_no;
    var sesa_no1 = req.session.sesa_no1;
    var order_date = req.body.order_date;

    console.log("Method: " + req.method);
    console.log(
      "put: ",
      sesa_no1,
      " ",
      supplier,
      " ",
      order_date,
      " ",
      "Numer dania ",
      order_no,
      " "
    );
    //base order_no, get from menu order_name and order_price
    var sql6 =
      "SELECT * FROM `elunch_menu2` WHERE `supplier_name`='" +
      supplier +
      "' and menu_no = '" +
      order_no +
      "'";
    console.log("sql6: ", sql6);
    db.query(sql6, function(err, results) {
      if (results.length) {
        menu_desctription = results[0].menu_desctription;
        console.log("menu_desctription: ", menu_desctription);
        menu_price = results[0].menu_price;
        //return menu_desctription;
        console.log("menu_price: ", menu_price);
      } else {
        message =
          "problem z pobraniem danych z bazy menu przed zapisem do bazy order2";
        res.render("index.ejs", { message: message });
      }
      console.log("order_date: ", order_date);
      // put order to DB
      var sql5 =
        "INSERT INTO `elunch_orders2`(`Id_sesa_no`,`order_date`,`order_supplier_name`,`order_no`,`order_name`, `order_price`) VALUES ('" +
        sesa_no1 +
        "','" +
        order_date +
        "','" +
        supplier +
        "','" +
        order_no +
        "','" +
        menu_desctription +
        "','" +
        menu_price +
        "')";
      console.log("SQL: ", sql5);
      db.query(sql5, function(err, results) {
        console.log("Inerted record to DB");
      });
    });
    res.render("new_order2.ejs");
  } else if (req.method == "DELETE") {
    var delete_id = req.body.delete_id;
    console.log("delete: ", delete_id);
    var sql7 = "DELETE FROM `elunch_orders2` WHERE `id` ='" + delete_id + "'";
    db.query(sql7, function(err, results) {
      console.log("deleted one row");
    });
  }
};
//--------------------------------render user details after login--------------------------------
exports.orders = function(req, res, next) {
  var userId = req.session.userId,
    fname = req.session.first_name,
    sesa_no1 = req.session.sesa_no1,
    data_from,
    data_to;

  data_from = req.body.data_from;
  data_to = req.body.data_to;
  console.log("data_from: ", data_from);
  console.log("data_from: ", data_to);
  console.log("cookies " + req.session.mySupplierCookies);
  // if (userId == null) {
  //   res.redirect("/login");
  //   return;
  // }

  if (req.method == "POST") {
    // var sql = "SELECT * FROM `elunch_orders2` WHERE `order_date`='" + data_from + "'";
    var sql =
      "SELECT * FROM `elunch_orders2` WHERE `order_date` BETWEEN '" +
      data_from +
      "' AND '" +
      data_to +
      "' ORDER BY ID DESC";
    console.log("sql: " + sql);
    db.query(sql, function(err, result) {
      ordersList = JSON.stringify(result);
      console.log("ordersList: ", ordersList);
      //res.render("orders.ejs", {ordersList});
      res.json({ message: result });
    });
  } else if (req.method == "GET") {
    res.render("orders.ejs");
    //res.json({ message: "result" });
  }
};
//--------------------------------render user details after login--------------------------------
exports.orders2 = function(req, res, next) {
  var userId = req.session.userId,
    fname = req.session.first_name,
    sesa_no1 = req.session.sesa_no1,
    data_from,
    data_to;

  data_from = req.body.data_from;
  data_to = req.body.data_to;
  console.log("data_from: ", data_from);
  console.log("data_from: ", data_to);
  console.log("cookies " + req.session.mySupplierCookies);
  // if (userId == null) {
  //   res.redirect("/login");
  //   return;
  // }

  if (req.method == "POST") {
    // var sql = "SELECT * FROM `elunch_orders2` WHERE `order_date`='" + data_from + "'";
    var sql =
      "SELECT * FROM `elunch_orders2` WHERE `order_date` BETWEEN '" +
      data_from +
      "' AND '" +
      data_to +
      "' AND `Id_sesa_no`='"+
      sesa_no1 +
      "' ORDER BY id DESC";
    console.log("sql: " + sql);
    db.query(sql, function(err, result) {
      ordersList = JSON.stringify(result);
      console.log("ordersList: ", ordersList);
      //res.render("orders.ejs", {ordersList});
      res.json({ message: result });
    });
  } else if (req.method == "GET") {
    res.render("orders2.ejs");
    //res.json({ message: "result" });
  }
};

//list
exports.list = function(req, res, next) {
var data_list;
data_list = req.body.data_list;
console.log("data_list1: ", data_list);

  if (req.method == "POST") {
    var sql =
    "select first_name, last_name, order_supplier_name,order_no,order_name  from elunch_users2 join  elunch_orders2 on elunch_users2.sesa_no = elunch_orders2.id_sesa_no  WHERE `order_date`='" +
    data_list + "' ORDER BY  order_no DESC";
    console.log("sql: " + sql);
    db.query(sql, function(err, result) {
    var list = JSON.stringify(result);
      console.log("list: ", list);
      //res.render("orders.ejs", {ordersList});
      res.json({ message: result });
    });
  } else if (req.method == "GET") {
    res.render("list.ejs");
  }
}

//raport
exports.raport = function(req, res, next) {
  var data_list;
  data_list = req.body.data_list;
  console.log("data_list1: ", data_list);
  
    if (req.method == "POST") {
      var sql =
      "select first_name, last_name, order_supplier_name,order_no,order_name  from elunch_users2 join  elunch_orders2 on elunch_users2.sesa_no = elunch_orders2.id_sesa_no  WHERE `order_date`='" +
      data_list + "' ORDER BY  order_no DESC";
      console.log("sql: " + sql);
      db.query(sql, function(err, result) {
      var list = JSON.stringify(result);
        console.log("list: ", list);
        //res.render("orders.ejs", {ordersList});
        res.json({ message: result });
      });
    } else if (req.method == "GET") {
      res.render("raport.ejs");
    }
  }