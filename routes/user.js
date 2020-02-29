//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function (req, res) {
  message = "";
  if (req.method == "POST") {
    var post = req.body;
    var name = post.user_name;
    var pass = post.password;
    var fname = post.first_name;
    var lname = post.last_name;
    var mob = post.person_no;
    var sesa_no1 = post.sesa_no1;

    var sql =
      "INSERT INTO `elunch_users2`(`sesa_no`,`first_name`,`last_name`,`person_no`,`user_name`, `password`) VALUES ('" +
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
      console.log(sql);
    var query = db.query(sql, function (err, result) {
      message = "Sukces! Twoje konto zostało utworzone.";
      res.render("signup.ejs", { message: message });
    });
  } else {
    res.render("signup");
  }
};
//-----------------------------------------------login page call------------------------------------------------------
exports.login = function (req, res) {
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
    db.query(sql, function (err, results) {
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
exports.dashboard = function (req, res, next) {
  var user = req.session.user,
    userId = req.session.userId,
    fname = req.session.first_name;

  console.log("Dashboard userID= " + userId);

  if (req.session.sesa_no1 == 9999) {
    res.render("admin.ejs");
    return;
  }

  if (userId == null) {
    res.redirect("/login");
    return;
  }

  var sql = "SELECT * FROM `elunch_users2` WHERE `id`='" + userId + "'";
  db.query(sql, function (err, results) {
    res.render("dashboard.ejs", { fname });
  });
};
//------------------------------------logout functionality----------------------------------------------
exports.logout = function (req, res) {
  req.session.destroy(function (err) {
    res.redirect("/login");
  });
};
//--------------------------------render user details after login--------------------------------
exports.profile = function (req, res) {
  var userId = req.session.userId;
  if (userId == null) {
    res.redirect("/login");
    return;
  }
  var sql = "SELECT * FROM `elunch_users2` WHERE `id`='" + userId + "'";
  db.query(sql, function (err, result) {
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

exports.new_order = function (req, res, next) {
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
    db.query(sql7, function (err, results) {
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
    db.query(sql6, function (err, results) {
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
      db.query(sql5, function (err, results) {
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
  db.query(sql1, function (err, results) {
    my_orders = JSON.stringify(results);
    console.log("my_orders: ", my_orders);
  });

  // display menu
  mysupplier_name = "Mucha";
  var sql3 =
    "SELECT * FROM `elunch_menu2` WHERE `supplier_name`='" +
    mysupplier_name +
    "'";
  db.query(sql3, function (err, results) {
    menu_json = JSON.stringify(results);
    console.log("menu_json: ", menu_json);
  });
  mysupplier_name = "Opoka";
  var sql4 =
    "SELECT * FROM `elunch_menu2` WHERE `supplier_name`='" +
    mysupplier_name +
    "'";
  db.query(sql4, function (err, results) {
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
exports.new_order2 = function (req, res, next) {
  if (req.method == "POST") {
    var mydate = req.body.my_date;
    var mysupplier = req.body.my_supplier;
    var sesa_no1 = req.session.sesa_no1;
    var fname = req.session.first_name;
    console.log("sesa_no1: " + sesa_no1);
    var d = new Date();
    var id_day = parseInt(d.getDay());
    console.log("id_day: ", id_day);

    // display menu
    mysupplier_name = mysupplier;
    var sql3 = "SELECT * FROM `elunch_menu2` WHERE `supplier_name`='" + mysupplier_name +
      "' AND (`id_day`= 0 OR `id_day`='" +
      id_day +
      "')";
    console.log("sql3: " + sql3);
    db.query(sql3, function (err, results) {
      menu_json = JSON.stringify(results);
      console.log("menu_json: ", menu_json);
    });

    // display current orders
    // var sql1 =
    //   "SELECT * FROM `elunch_orders2` WHERE `order_date`='" +
    //   mydate +
    //   "' AND `Id_sesa_no`='" +
    //   sesa_no1 +
    //   "' ORDER BY id DESC";
    var sql1 =
    "SELECT  elunch_orders2.id, Id_sesa_no ,first_name, last_name, order_date, order_supplier_name, order_no, order_name, order_price, founding, deduction FROM elunch_users2 join elunch_orders2 on elunch_users2.sesa_no = elunch_orders2.Id_sesa_no WHERE `order_date`='" +
    mydate +
    "' ORDER BY elunch_orders2.id DESC";
    console.log("sql1: " + sql1);

    db.query(sql1, function (err, results) {
      //console.log("results: " + results);
      orders_json = JSON.stringify(results);
      console.log("orders_json: ", orders_json);
      res.json({ table_data: results, table_supplier: JSON.parse(menu_json), fname: fname, sesa_no1: sesa_no1 });
    });
  } else if (req.method == "GET") {
    res.render("new_order2.ejs");
  } else if (req.method == "PUT") {
    var supplier = req.body.supplier;
    var order_no;
    var sesa_no1 = req.session.sesa_no1;
    var order_date = req.body.order_date;
    var id = req.body.id;
    var founding, deduction;
    var sumOfFounding; 
    const dailyFounding = 7;
    // to check if user aleready order something to setup right deduction (potrącenia) & founding (dofinansowanie) 
    // Daily founding =7pln
    // 1. to check if today it was ordered 
    //    if Yes (deduct from  all of dayli orders founding 7 pln ) 
    //    if not deduct from founding 7 pln
    // 2. put to deduction difference between order_price and founding
    //
    console.log("Method: " + req.method);
    console.log("put: ", sesa_no1, " ", supplier, " ", order_date, " ", "id ", id);
    //base id (previously order_no), get from menu order_name and order_price
    var sql6 = "SELECT * FROM `elunch_menu2` WHERE `id`='" + id + "'";
    console.log("sql6: ", sql6);

    db.query(sql6, function (err, results) {
      if (results.length) {
        menu_desctription = results[0].menu_desctription;
        console.log("menu_desctription: ", menu_desctription);
        menu_price = results[0].menu_price;
        //return menu_desctription;
        console.log("menu_price: ", menu_price);
        menu_no = results[0].menu_no;
        //return menu_no;
        console.log("menu_no: ", menu_no);
      } else {
        message =
          "problem z pobraniem danych z bazy menu przed zapisem do bazy order2";
        res.render("index.ejs", { message: message });
      }
      console.log("order_date: ", order_date);

      //
      var sql2 = "SELECT SUM(`founding`) FROM `elunch_orders2` WHERE `order_date` = '" + order_date +
      "' AND `Id_sesa_no`='" + sesa_no1 +  "'";

      console.log("sql2: " + sql2);
      db.query(sql2, function (err, results) {
        sumOfFounding = Object.values(results[0]);
        console.log("SumOfFounding: " + sumOfFounding)
        if (sumOfFounding < 7){
          founding = dailyFounding - sumOfFounding;
          deduction = menu_price- founding
          if (menu_price <= 7) { 
            founding = menu_price
            if (sumOfFounding + founding >= 7 ){
              var x = 7 - sumOfFounding
              console.log("x: " +x)
              founding = x 
              console.log("founding :" + founding)
            }
            deduction = menu_price            
          }
          if (deduction<0) { deduction=0}
        } else{
          founding =0;
          deduction = menu_price;
        }
              // put order to DB
      var sql5 =
      "INSERT INTO `elunch_orders2`(`Id_sesa_no`,`order_date`,`order_supplier_name`,`order_no`,`order_name`, `order_price`, `founding`,`deduction`) VALUES ('" +
      sesa_no1 +
      "','" +
      order_date +
      "','" +
      supplier +
      "','" +
      menu_no +
      "','" +
      menu_desctription +
      "','" +
      menu_price +
      "','" +
      founding +
      "','" +
      deduction +
      "')";
    console.log("SQL: ", sql5);
    db.query(sql5, function (err, results) {
      console.log("Inerted record to DB");
    });

      });


    });
    res.render("new_order2.ejs");
  } else if (req.method == "DELETE") {
    var delete_id = req.body.delete_id;
    console.log("delete: ", delete_id);
    var sql7 = "DELETE FROM `elunch_orders2` WHERE `id` ='" + delete_id + "'";
    db.query(sql7, function (err, results) {
      console.log("deleted one row");
    });
  }
};
//--------------------------------render user details after login--------------------------------
exports.orders = function (req, res, next) {
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
    db.query(sql, function (err, result) {
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
exports.orders2 = function (req, res, next) {
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
    var sql =
      "SELECT * FROM elunch_users2 join elunch_orders2 on elunch_users2.sesa_no = elunch_orders2.Id_sesa_no WHERE `order_date` BETWEEN '" +
      data_from +
      "' AND '" +
      data_to +
      "' AND `Id_sesa_no`='" +
      sesa_no1 +
      "' ORDER BY elunch_orders2.id DESC";

  console.log("sql: " + sql);
    db.query(sql, function (err, result) {
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
exports.list = function (req, res, next) {
  var data_list;
  data_list = req.body.data_list;
  console.log("data_list1: ", data_list);

  if (req.method == "POST") {
    var sql =
      "select first_name, last_name, order_supplier_name,order_no,order_name  from elunch_users2 join  elunch_orders2 on elunch_users2.sesa_no = elunch_orders2.id_sesa_no  WHERE `order_date`='" +
      data_list + "' ORDER BY  order_no DESC";
    console.log("sql: " + sql);
    db.query(sql, function (err, result) {
      var list = JSON.stringify(result);
      console.log("list: ", list);
      //res.render("orders.ejs", {ordersList});
      res.json({ message: result });
    });
  } else if (req.method == "GET") {
    res.render("new_list.ejs");
  }
};
//raport
exports.raport = function (req, res, next) {
  var data_list;
  data_list = req.body.data_list;
  console.log("data_list1: ", data_list);

  if (req.method == "POST") {
    var sql =
      "select first_name, last_name, order_supplier_name,order_no,order_name  from elunch_users2 join  elunch_orders2 on elunch_users2.sesa_no = elunch_orders2.id_sesa_no  WHERE `order_date`='" +
      data_list + "' ORDER BY  order_no DESC";
    console.log("sql: " + sql);
    db.query(sql, function (err, result) {
      var list = JSON.stringify(result);
      console.log("list: ", list);
      //res.render("orders.ejs", {ordersList});
      res.json({ message: result });
    });
  } else if (req.method == "GET") {
    res.render("raport.ejs");
  }
};
//admin
exports.admin = function (req, res, next) {
  var id = req.body.id;
  var sesa = req.body.sesa_no;
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var person_no = req.body.person_no;
  var user_name = req.body.user_name;
  var password = req.body.password;
  var myid = req.body.myid;
  var dataForUpdate;
  var supplier_name, menu_no, menu_desctription, menu_price, id_day;
  var user, menu, results2;


  if (req.method == "POST") {
    var sesa = req.session.sesa_no1;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var person_no = req.body.person_no;
    var user_name = req.body.user_name;
    var password = req.body.password;
    var supplier_name = req.body.supplier_name;
    var menu_no = req.body.menu_no;
    var menu_desctription = req.body.menu_desctription;
    var menu_price = req.body.menu_price;
    var id_day = req.body.id_day;

    console.log("Method: " + req.method);
    console.log("user: " + sesa + " " + first_name + " " + last_name + " " + person_no + " " + user_name + " " + password);
    console.log("menu: " + sesa + " " + supplier_name + " " + menu_no + " " + menu_desctription + " " + menu_price + " " + id_day);

    if (sesa && first_name && last_name && person_no && user_name && password) {
      // user 
      var sql = "INSERT INTO `elunch_users2`(`sesa_no`,`first_name`,`last_name`,`person_no`,`user_name`, `password`) VALUES ('" +
        sesa +
        "','" +
        first_name +
        "','" +
        last_name +
        "','" +
        person_no +
        "','" +
        user_name +
        "','" +
        password +
        "')";

      console.log("POST sql user: " + sql);
      db.query(sql, function (err, result) {
        user = result;
        var users1 = JSON.stringify(result);
        console.log("users1: ", users1);
        // res.json({ message: result });
      });
    } else if (sesa && supplier_name && menu_no && menu_desctription && menu_price && id_day) {
      // menu
      var sql20 = "INSERT INTO `elunch_menu2` (`supplier_name`,`menu_no`,`menu_desctription`,`menu_price`, `id_day`) VALUES ('" +
        supplier_name +
        "','" +
        menu_no +
        "','" +
        menu_desctription +
        "','" +
        menu_price +
        "','" +
        id_day +
        "')";

      console.log("POST menu sql: " + sql20);
      db.query(sql20, function (err, result) {
        var menu = JSON.stringify(result);
        console.log("menu: ", result);
        res.json({ message: user, messageMenu: result });
      });

    }


  } else if (req.method == "GET") {
    console.log("Method: " + req.method);
    //user 
    var row = req.query.row;
    console.log("row: " + row);
    var sql17 = "SELECT * FROM `elunch_users2` WHERE `id` ='" + row + "'";
    db.query(sql17, function (err, results) {
      console.log("row user selected :" + results);
      dataForUpdate = results;
    });

    var sql21 = "select * from elunch_menu2 WHERE 1 ORDER BY id DESC";
    console.log("sql21: " + sql21);
    db.query(sql21, function (err, results) {
      results2 = results;
      console.log("result2: " + results2);
      // res.json({ message: result, dataForUpdate:dataForUpdate });
    });

    // menu
    var row = req.query.row;
    console.log("row: " + row);
    var sql18 = "SELECT * FROM `elunch_menu2` WHERE `id` ='" + row + "'";
    db.query(sql18, function (err, results) {
      console.log("row menu selected :" + results);
      var menu2 = JSON.stringify(results);
      console.log("row menu selected :" + menu2);
      menuForUpdate = results;
    });

    var sql = "select * from elunch_users2 WHERE 1 ORDER BY id DESC";
    console.log("sql: " + sql);
    db.query(sql, function (err, result) {
      var users = JSON.stringify(result);
      console.log("user list: ", users);
      res.json({ message: result, message2: results2, dataForUpdate: dataForUpdate, menuForUpdate: menuForUpdate });
    });

  } else if (req.method == "DELETE") {
    console.log("Method: " + req.method);
    //user
    if (req.body.delete_id > 0) {
      var delete_id = req.body.delete_id;
      console.log("delete user: ", delete_id);
      var sql7 = "DELETE FROM `elunch_users2` WHERE `id` ='" + delete_id + "'";
      db.query(sql7, function (err, results) {
        console.log("deleted user one row " + delete_id);
      });
    }
    //menu
    if (req.body.delete_id3 > 0) {
      var mydelete_id3 = req.body.delete_id3;
      console.log("delete menu: ", mydelete_id3);
      var sql37 = "DELETE FROM `elunch_menu2` WHERE `id` ='" + mydelete_id3 + "'";
      db.query(sql37, function (err, results) {
        console.log("deleted menu one row " + mydelete_id3);
      });
    }

  } else if (req.method == "PUT") {
    console.log("Method: " + req.method);
    console.log("put " + myid + " " + sesa + " " + first_name + " " + last_name + " " + person_no + " " + user_name + " " + password);

    var sql13 = "UPDATE elunch_users2 SET sesa_no=" +
      sesa +
      ", first_name='" +
      first_name +
      "', last_name='" +
      last_name +
      "', person_no=" +
      person_no +
      ", user_name='" +
      user_name +
      "', password=" +
      password +
      " WHERE id=" +
      id +
      "";

    console.log("sql13: " + sql13);
    db.query(sql13, function (err, result) {
      console.log(" updated row no. :" + id);
    });

    var updateMenu = req.body.updateMenu;
    if (updateMenu == "updateMenu") {
      var myid2 = req.body.myid2;
      var supplier_name = req.body.supplier_name;
      var menu_no = req.body.menu_no;
      var menu_desctription = req.body.menu_desctription;
      var menu_price = req.body.menu_price;
      var id_day = req.body.id_day;

      console.log("put " + myid2 + " " + supplier_name + " " + menu_no + " " + menu_desctription + " " + menu_price + " " + id_day );

      var sql23 = "UPDATE elunch_menu2 SET supplier_name='" +
        supplier_name +
        "', menu_no=" +
        menu_no +
        ", menu_desctription='" +
        menu_desctription +
        "', menu_price=" +
        menu_price +
        ", id_day=" +
        id_day +
        " WHERE id=" +
        myid2 +
        "";

      console.log("sql23: " + sql23);
      db.query(sql23, function (err, result) {
        console.log(" updated menu row no. :" + myid2);
      });

    }
    res.render("admin.ejs");
  }
};
//users
exports.users = function (req, res, next) {
  var id = req.body.id;
  var sesa = req.body.sesa_no;
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var person_no = req.body.person_no;
  var user_name = req.body.user_name;
  var password = req.body.password;
  var myid = req.body.myid;
  var dataForUpdate;
  var supplier_name, menu_no, menu_desctription, menu_price, id_day;
  var user, menu, results2;
  if (req.method == "POST") {
    var sesa = req.session.sesa_no1;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var person_no = req.body.person_no;
    var user_name = req.body.user_name;
    var password = req.body.password;
    var supplier_name = req.body.supplier_name;
    var menu_no = req.body.menu_no;
    var menu_desctription = req.body.menu_desctription;
    var menu_price = req.body.menu_price;
    var id_day = req.body.id_day;
    var results2, menuForUpdate;

    console.log("Method: " + req.method);
    console.log("user: " + sesa + " " + first_name + " " + last_name + " " + person_no + " " + user_name + " " + password);
    var menuForUpdate;
    var mypost = req.body.mypost;

    if (mypost == "mypost"){
      var sql21 = "select * from elunch_users2 WHERE 1 ORDER BY id DESC";
      console.log("sql21: " + sql21);
      db.query(sql21, function (err, results) {
        results2 = results;
        var results3 = JSON.stringify(results);
        console.log("result3: " + results3);
        // users
        var row = req.body.row;
        if (row >0){
          console.log("row: " + row);
          var sql18 = "SELECT * FROM `elunch_users2` WHERE `id` ='" + row + "'";
          db.query(sql18, function (err, results) {
            menuForUpdate = results;
            console.log("row menu selected :" + results);
            var users2 = JSON.stringify(results);
            console.log("row menu selected2 :" + users2);
            console.log("menuForUpdate2" , menuForUpdate);
            res.json({menuForUpdate: menuForUpdate});
          });        
        } else {
          console.log("res2", results2)
          res.json({message2: results2});
          return;
        }
      });
      
    }
    if (req.body.addUsers == "addUsers"){
      console.log ("jestem w ADDUsers");
      var sesa = req.body.sesa_no;
      if (sesa && first_name && last_name && person_no && user_name && password) {
        // user 
        var sql = "INSERT INTO `elunch_users2`(`sesa_no`,`first_name`,`last_name`,`person_no`,`user_name`, `password`) VALUES ('" +
          sesa +
          "','" +
          first_name +
          "','" +
          last_name +
          "','" +
          person_no +
          "','" +
          user_name +
          "','" +
          password +
          "')";

        console.log("POST sql user: " + sql);
        db.query(sql, function (err, result) {
          user = result;
          var users1 = JSON.stringify(result);
          console.log("users1: ", users1);
          res.json({ message: result });
        });
      }
    }
  } else if (req.method == "GET") {
    console.log("Method: " + req.method);     
    res.render("users.ejs");
  } else if (req.method == "DELETE") {
    console.log("Method: " + req.method);
    //user
    if (req.body.delete_id3 > 0) {
      var delete_id3 = req.body.delete_id3;
      console.log("delete user: ", delete_id3);
      var sql7 = "DELETE FROM `elunch_users2` WHERE `id` ='" + delete_id3 + "'";
      db.query(sql7, function (err, results) {
        console.log("deleted user one row " + delete_id3);
      });
    }
    

  } else if (req.method == "PUT") {
    console.log("Method: " + req.method);
    console.log("put " + myid + " " + sesa + " " + first_name + " " + last_name + " " + person_no + " " + user_name + " " + password);

    var sql13 = "UPDATE elunch_users2 SET sesa_no=" +
      sesa +
      ", first_name='" +
      first_name +
      "', last_name='" +
      last_name +
      "', person_no=" +
      person_no +
      ", user_name='" +
      user_name +
      "', password=" +
      password +
      " WHERE id=" +
      id +
      "";

      db.query(sql13, function (err, result) {
      console.log(" updated row no. :" + id);
    });

    var updateMenu = req.body.updateMenu;
    if (updateMenu == "updateUsers") {
      var myid2 = req.body.myid2;
      var supplier_name = req.body.supplier_name;
      var menu_no = req.body.menu_no;
      var menu_desctription = req.body.menu_desctription;
      var menu_price = req.body.menu_price;
      var id_day = req.body.id_day;

      console.log("put " + myid2 + " " + supplier_name + " " + menu_no + " " + menu_desctription + " " + menu_price + " " + id_day );

      var sql23 = "UPDATE elunch_users2 SET supplier_name='" +
        supplier_name +
        "', menu_no=" +
        menu_no +
        ", menu_desctription='" +
        menu_desctription +
        "', menu_price=" +
        menu_price +
        ", id_day=" +
        id_day +
        " WHERE id=" +
        myid2 +
        "";

      console.log("sql23: " + sql23);
      db.query(sql23, function (err, result) {
        console.log(" updated menu row no. :" + myid2);
      });

    }
    res.render("users.ejs");
  }
};
//menu
exports.menu = function (req, res, next) {
  var sesa = req.body.sesa_no;
  var supplier_name, menu_no, menu_desctription, menu_price, id_day;
  var user, menu, results2, menuForUpdate;
  if (req.method == "POST") {
    var sesa = req.session.sesa_no1;
    var supplier_name = req.body.supplier_name;
    var menu_no = req.body.menu_no;
    var menu_desctription = req.body.menu_desctription;
    var menu_price = req.body.menu_price;
    var id_day = req.body.id_day;
    var mypost = req.body.mypost;
  
    console.log("Method: " + req.method);
    console.log("menu: " + sesa + " " + supplier_name + " " + menu_no + " " + menu_desctription + " " + menu_price + " " + id_day);
    
    if (mypost == "mypost"){
      var menuForUpdate;
      var sql21 = "select * from elunch_menu2 WHERE 1 ORDER BY id DESC";
      console.log("sql21: " + sql21);
      db.query(sql21, function (err, results) {
        results2 = results;
        var results3 = JSON.stringify(results);
        console.log("result3: " + results3);
        // menu
        var row = req.body.row;
        if (row >0){
          console.log("row: " + row);
          var sql18 = "SELECT * FROM `elunch_menu2` WHERE `id` ='" + row + "'";
          db.query(sql18, function (err, results) {
            menuForUpdate = results;
            console.log("menuForUpdate1" , menuForUpdate);
            console.log("row menu selected :" + results);
            var menu2 = JSON.stringify(results);
            console.log("row menu selected :" + menu2);
            console.log("menuForUpdate2" , menuForUpdate);
            res.json({menuForUpdate: menuForUpdate});
          });        
        } else {
          res.json({message2: results2});
          return;
        }
      });
    }
    if (req.body.addMenu == "addMenu"){
      console.log ("jestem w ADDMenu");
      if (sesa && supplier_name && menu_no && menu_desctription && menu_price && id_day) {
        // menu
        var sql20 = "INSERT INTO `elunch_menu2` (`supplier_name`,`menu_no`,`menu_desctription`,`menu_price`, `id_day`) VALUES ('" +
          supplier_name +
          "','" +
          menu_no +
          "','" +
          menu_desctription +
          "','" +
          menu_price +
          "','" +
          id_day +
          "')";
  
        console.log("POST menu sql: " + sql20);
        db.query(sql20, function (err, result) {
          var menu = JSON.stringify(result);
          console.log("menu: ", result);
          res.json({ message: user, messageMenu: result });
        });
  
      }
    }
  } else if (req.method == "GET") {
    console.log("Method: " + req.method);     
    res.render("menu.ejs");  
  } else if (req.method == "DELETE") {
    console.log("Method: " + req.method);
    //menu
    if (req.body.delete_id3 > 0) {
      var mydelete_id3 = req.body.delete_id3;
      console.log("delete menu: ", mydelete_id3);
      var sql37 = "DELETE FROM `elunch_menu2` WHERE `id` ='" + mydelete_id3 + "'";
      db.query(sql37, function (err, results) {
        console.log("deleted menu one row " + mydelete_id3);
      });
    }

  } else if (req.method == "PUT") {
    console.log("Method: " + req.method);
    var updateMenu = req.body.updateMenu;
    if (updateMenu == "updateMenu") {
      var myid2 = req.body.myid2;
      var supplier_name = req.body.supplier_name;
      var menu_no = req.body.menu_no;
      var menu_desctription = req.body.menu_desctription;
      var menu_price = req.body.menu_price;
      var id_day = req.body.id_day;

      console.log("put " + myid2 + " " + supplier_name + " " + menu_no + " " + menu_desctription + " " + menu_price + " " + id_day );

      var sql23 = "UPDATE elunch_menu2 SET supplier_name='" +
        supplier_name +
        "', menu_no=" +
        menu_no +
        ", menu_desctription='" +
        menu_desctription +
        "', menu_price=" +
        menu_price +
        ", id_day=" +
        id_day +
        " WHERE id=" +
        myid2 +
        "";

      console.log("sql23: " + sql23);
      db.query(sql23, function (err, result) {
        console.log(" updated menu row no. :" + myid2);
      });

    }
    res.render("menu.ejs");
  }  
}
exports.guest = function (req, res, next) {
  if (req.method == "POST") { 
    var mydate = req.body.my_date;
    var mysupplier = req.body.my_supplier;
    var menu_json, orders_json;
    var sesa_no1 =req.session.sesa_no1; 
    console.log ("sesa w post: " + sesa_no1);
    // display menu
    mysupplier_name = mysupplier;
    var sql3 = "SELECT * FROM `elunch_menu2` WHERE `supplier_name`='" + mysupplier_name + "'";
    console.log("sql3: " + sql3);
    db.query(sql3, function (err, results) {      
      var menu_json1 = JSON.stringify(results);
      menu_json = results;
      console.log("menu_json1: ", menu_json1);
    });

    // display current orders
    var sql1 = "SELECT elunch_gusets2.id, guest_name, who_order_sesa ,first_name, last_name, data, cost_center, departament, supplier, menu_no,menu_desctription, menu_price FROM elunch_users2 join elunch_gusets2 on elunch_users2.sesa_no = elunch_gusets2.who_order_sesa WHERE 1 ORDER BY id DESC";
    console.log("sql1: " + sql1);

    db.query(sql1, function (err, results) {
      //console.log("results: " + results);
      orders_json = results;
      var orders_json1 = JSON.stringify(results);
      console.log("orders_json: ", orders_json1);
      res.json({ table_data: orders_json, table_supplier: menu_json, sesa_no1: sesa_no1});
    });

  } else if (req.method == "GET") {
  res.render("guest.ejs")
  } else if (req.method == "PUT") {
    var supplier = req.body.supplier;
    var order_no;
    var sesa_no1 = req.body.sesa_no1;
    var order_date = req.body.order_date;
    var id = req.body.id;
    var guestName =req.body.guestName;
    var departament =req.body.departament;
    var cost_center =req.body.cost_center;
    var menu_no =req.body.menu_no;
    var menu_desctription = req.body.menu_desctription;
    var menu_price =req.body.menu_price;


    console.log("Method: " + req.method);
    console.log(
      "put: ",
      sesa_no1,
      " ",
      supplier,
      " ",
      order_date,
      " ",
      "id ",
      id);
    //base id (previously order_no), get from menu order_name and order_price
    var sql6 =
      "SELECT * FROM `elunch_menu2` WHERE `id`='" +
      id +
      "'";
    console.log("sql6: ", sql6);
    db.query(sql6, function (err, results) {
      if (results.length) {
        menu_desctription = results[0].menu_desctription;
        console.log("menu_desctription: ", menu_desctription);
        menu_price = results[0].menu_price;
        //return menu_desctription;
        console.log("menu_price: ", menu_price);
        menu_no = results[0].menu_no;
        //return menu_no;
        console.log("menu_no: ", menu_no);
      } else {
        message =
          "problem z pobraniem danych z bazy menu przed zapisem do bazy order2";
        res.render("index.ejs", { message: message });
      }
      console.log("order_date: ", order_date);
      // put order to DB
      var sql5 =
        "INSERT INTO `elunch_gusets2`(`guest_name`,`who_order_sesa`,`data`,`cost_center`,`departament`,`supplier`,`menu_no`, `menu_desctription`, `menu_price`) VALUES ('" +
        guestName +
        "','" +
        sesa_no1 +
        "','" +
        order_date +
        "','" +
        departament +
        "','" +
        cost_center +
        "','" +
        supplier +
        "','" +
        menu_no +
        "','" +
        menu_desctription +
        "','" +
        menu_price +       
        "')";
      console.log("SQL: ", sql5);
      db.query(sql5, function (err, results) {
        console.log("Inerted record to DB");
      });
    });
    res.render("guest.ejs");
  } else if (req.method == "DELETE") {
    var delete_id3 = req.body.delete_id3;
    console.log("delete: ", delete_id3);
    var sql7 = "DELETE FROM `elunch_gusets2` WHERE `id` ='" + delete_id3 + "'";
    console.log("sql7: ", sql7);
    db.query(sql7, function (err, results) {
      console.log("deleted one row");
    });
  }
};
exports.additional = function (req, res, next) {
  if (req.method == "POST") {
    var mydate = req.body.my_date;
    var mysupplier = req.body.my_supplier;
    var sesa_no1 = req.session.sesa_no1; 
    var menu_json, users_json;
    // var d = new Date();
    // var id_day = parseInt(d.getDay());
    // console.log("id_day: ", id_day);

    // display users sesa: name surname
    var sql27 = "select sesa_no, first_name, last_name  from elunch_users2 WHERE 1 ORDER BY id DESC";
    console.log("sql27: " + sql27);
    db.query(sql27, function (err, results) {
      users_json = results;
      var results3 = JSON.stringify(results);
      console.log("sesa_no first last name: " , results3);
      // users
     
    });

    // display menu
    mysupplier_name = mysupplier;
    var sql3 = "SELECT * FROM `elunch_menu2` WHERE `supplier_name`='" + mysupplier_name + "'";
    console.log("sql3: " + sql3);
    db.query(sql3, function (err, results) {
      menu_json = JSON.stringify(results);
      console.log("menu_json: ", menu_json);
    });

    //SELECT  sesa_no ,first_name, last_name,order_no, order_date FROM elunch_users2 join elunch_orders2 on elunch_users2.sesa_no = elunch_orders2.Id_sesa_no WHERE 1
    // display current orders
    // var sql1 =
    //   "SELECT * FROM `elunch_orders2` WHERE `order_date`='" +
    //   mydate +
    //   "' ORDER BY id DESC";
    var sql1 =
      "SELECT  elunch_orders2.id, Id_sesa_no ,first_name, last_name, order_date, order_supplier_name, order_no, order_name, order_price FROM elunch_users2 join elunch_orders2 on elunch_users2.sesa_no = elunch_orders2.Id_sesa_no WHERE `order_date`='" +
      mydate +
      "' ORDER BY elunch_orders2.id DESC";
    console.log("sql1: " + sql1);

    db.query(sql1, function (err, results) {
      //console.log("results: " + results);
      orders_json = JSON.stringify(results);
      console.log("orders_json: ", orders_json);
      res.json({ table_data: results, table_supplier: JSON.parse(menu_json),users_json:users_json });
    });
  } else if (req.method == "GET") {
    res.render("additional.ejs");
  } else if (req.method == "PUT") {
    var supplier = req.body.supplier;
    var order_no;
    var sesa_no1 = req.body.sesa_no1;
    var order_date = req.body.order_date;
    var id = req.body.id;

    console.log("Method: " + req.method);
    console.log(
      "put: ",
      sesa_no1,
      " ",
      supplier,
      " ",
      order_date,
      " ",
      "id ",
      id);
    //base id (previously order_no), get from menu order_name and order_price
    var sql6 =
      "SELECT * FROM `elunch_menu2` WHERE `id`='" +
      id +
      "'";
    console.log("sql6: ", sql6);
    db.query(sql6, function (err, results) {
      if (results.length) {
        menu_desctription = results[0].menu_desctription;
        console.log("menu_desctription: ", menu_desctription);
        menu_price = results[0].menu_price;
        //return menu_desctription;
        console.log("menu_price: ", menu_price);
        menu_no = results[0].menu_no;
        //return menu_no;
        console.log("menu_no: ", menu_no);
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
        menu_no +
        "','" +
        menu_desctription +
        "','" +
        menu_price +
        "')";
      console.log("SQL: ", sql5);
      db.query(sql5, function (err, results) {
        console.log("Inerted record to DB");
      });
    });
    res.render("new_order2.ejs");
  } else if (req.method == "DELETE") {
    var delete_id = req.body.delete_id;
    console.log("delete: ", delete_id);
    var sql7 = "DELETE FROM `elunch_orders2` WHERE `id` ='" + delete_id + "'";
    db.query(sql7, function (err, results) {
      console.log("deleted one row");
    });
  }
  // res.render("additional.ejs")
};
