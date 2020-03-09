//-----------------------------------------------login page call------------------------------------------------------
exports.login = function(req, res) {
  var message = "";
  var sess = req.session;

  if (req.method == "POST") {
    var post = req.body;
    var name = post.user_name;
    var pass = post.password;
    var sesa_no1 = post.sesa_no1;  

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
        req.session.last_name = results[0].last_name;
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
  userId = req.session.userId,
  fname = req.session.first_name;

  if (req.session.sesa_no1 == 9999) {
    res.render("admin.ejs");
    return;
  }

  if (userId == null) {
    res.redirect("/login");
    return;
  }
  
  res.render("dashboard.ejs", { fname });

};
//------------------------------------logout functionality----------------------------------------------
exports.logout = function(req, res) {
  req.session.destroy(function(err) {
    res.redirect("/login");
  });
};
//------------------------------------order lunch ------------------------------------------------------
exports.new_order2 = function(req, res, next) {
  userId = req.session.userId;
  if (userId == null) {
    res.redirect("/login");
    return;
  }
  if (req.method == "POST") {
    var mydate = req.body.my_date;
    var mysupplier = req.body.my_supplier;
    var sesa_no1 = req.session.sesa_no1;
    var fname = req.session.first_name;
    var lname = req.session.last_name;

    var d = new Date();
    var id_day = parseInt(d.getDay());

    // display menu
    mysupplier_name = mysupplier;
    var sql3 =
      "SELECT * FROM `elunch_menu2` WHERE `supplier_name`='" +
      mysupplier_name +
      "' AND (`id_day`= 0 OR `id_day`='" +
      id_day +
      "')";

    db.query(sql3, function(err, results) {
      menu_json = JSON.stringify(results);
      //console.log("menu_json: ", menu_json);
    });

    var sql1 =
      "SELECT  elunch_orders2.id, Id_sesa_no ,first_name, last_name, order_date, order_supplier_name, order_no, order_name, order_price, founding, deduction FROM elunch_users2 join elunch_orders2 on elunch_users2.sesa_no = elunch_orders2.Id_sesa_no WHERE `order_date`='" +
      mydate +
      "' AND `Id_sesa_no`='" +
      sesa_no1 +
      "' ORDER BY elunch_orders2.id DESC";

    db.query(sql1, function(err, results) {
      orders_json = JSON.stringify(results);
      // console.log("orders_json: ", orders_json);
      res.json({
        table_data: results,
        table_supplier: JSON.parse(menu_json),
        fname: fname,
        lname: lname,
        sesa_no1: sesa_no1
      });
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
    
    //console.log("Method: " + req.method);
    //console.log("put: ", sesa_no1, " ", supplier, " ", order_date, " ", "id ", id);

    //base id (previously order_no), get from menu order_name and order_price
    var sql6 = "SELECT * FROM `elunch_menu2` WHERE `id`='" + id + "'";
    db.query(sql6, function(err, results) {
      if (results.length) {
        menu_desctription = results[0].menu_desctription;
        menu_price = results[0].menu_price;
        menu_no = results[0].menu_no;
      } else {
        message = "problem z pobraniem danych z bazy menu przed zapisem do bazy order2";
        res.render("index.ejs", { message: message });
      }
      //
      var sql2 = "SELECT SUM(`founding`) FROM `elunch_orders2` WHERE `order_date` = '" +
        order_date +
        "' AND `Id_sesa_no`='" +
        sesa_no1 +
        "'";
      db.query(sql2, function(err, results) {
        sumOfFounding = results[0]["SUM(`founding`)"];
        console.log("SumOfFounding: " + sumOfFounding);
        if (sumOfFounding < 7) {
          founding = dailyFounding - sumOfFounding;
          deduction = menu_price - founding;
          console.log("founding :" + founding);
          console.log("deduction :" + deduction);
          if (menu_price <= 7) {
            founding = menu_price;
            console.log("founding1 :" + founding);
            console.log("deduction1 :" + deduction);
            if (sumOfFounding + founding >= 7) {
              var x = 7 - sumOfFounding;
              //console.log("x: " + x);
              founding = x;
              console.log("founding2 :" + founding);
              console.log("deduction2 :" + deduction);
            }
            deduction = menu_price - founding;
            console.log("founding3 :" + founding);
            console.log("deduction3 :" + deduction);
          }
          if (deduction < 0) {
            deduction = 0;
          }
        } else {
          founding = 0;
          deduction = menu_price;
          console.log("founding4 :" + founding);
          console.log("deduction4 :" + deduction);
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
        // console.log("SQL: ", sql5);
        db.query(sql5, function(err, results) {
          console.log("Inerted record to DB");
        });
      });
    });
    res.render("new_order2.ejs");
  } else if (req.method == "DELETE") {
    var delete_id = req.body.delete_id;
    var sql7 = "DELETE FROM `elunch_orders2` WHERE `id` ='" + delete_id + "'";
    db.query(sql7, function(err, results) {
      console.log("deleted row " + delete_id);
    });
  }
};
//--------------------------------render user details after login--------------------------------
exports.orders2 = function(req, res, next) {
  var userId = req.session.userId,
    sesa_no1 = req.session.sesa_no1,
    data_from,
    data_to;

  data_from = req.body.data_from;
  data_to = req.body.data_to;
  // console.log("data_from: ", data_from);
  // console.log("data_from: ", data_to);
  // console.log("cookies " + req.session.mySupplierCookies);
  
  if (userId == null) {
    res.redirect("/login");
    return;
  }

  if (req.method == "POST") {
    var sql =
      "SELECT * FROM elunch_users2 join elunch_orders2 on elunch_users2.sesa_no = elunch_orders2.Id_sesa_no WHERE `order_date` BETWEEN '" +
      data_from +
      "' AND '" +
      data_to +
      "' AND `Id_sesa_no`='" +
      sesa_no1 +
      "' ORDER BY elunch_orders2.id DESC";

    db.query(sql, function(err, result) {
      res.json({ message: result });
    });
  } else if (req.method == "GET") {
    res.render("orders2.ejs");
  }
};
//---------------------------------list----------------------------------------------------------
exports.list = function(req, res, next) {
  var data_list;
  data_list = req.body.data_list;

  if (req.method == "POST") {
    var sql =
      "select first_name, last_name, order_supplier_name,order_no,order_name  from elunch_users2 join  elunch_orders2 on elunch_users2.sesa_no = elunch_orders2.id_sesa_no  WHERE `order_date`='" +
      data_list +
      "' ORDER BY  order_no DESC";
    db.query(sql, function(err, result) {
      res.json({ message: result });
    });
  } else if (req.method == "GET") {
    res.render("new_list.ejs");
  }
};
//----------------------------------raport2------------------------------------------------------
exports.raport = function(req, res, next) {
  var data_from, data_to, supplierValue, typeValue;
  data_from = req.body.data_from;
  data_to = req.body.data_to;
  raportValue = req.body.raportValue;
  typeValue = req.body.typeValue;
  var founding, deduction, mySQLtext;

  // console.log("data_from: ", data_from);
  // console.log("data_to: ", data_to);
  // console.log("raportValue: ", raportValue);
  // console.log("typeValue: ", typeValue);
  if (raportValue == "founding") {
    mySQLtext = "SUM(`founding`)";
  } else if (raportValue == "deduction") {
    mySQLtext = "SUM(`deduction`)";
  }

  if (typeValue == "dvc") {
    mySQLtype = "DVC";
  } else if (typeValue == "mbc") {
    mySQLtype = "MBC";
  }

  if (req.method == "POST") {
    var sql =
      "select " +
      mySQLtext +
      ", CONCAT(first_name, ' ', last_name) AS name, person_no, first_name, last_name   from elunch_users2 join  elunch_orders2 on elunch_users2.sesa_no = elunch_orders2.id_sesa_no WHERE `order_date` BETWEEN '" +
      data_from +
      "' AND '" +
      data_to +
      "' AND `user_name`='" +
      mySQLtype +
      "' GROUP BY person_no";
    db.query(sql, function(err, result) {
      res.json({ message: result });
    });
  } else if (req.method == "GET") {
    res.render("raport.ejs");
  }
};
//-------------------------------------admin----------------------------------------------------
exports.admin = function(req, res, next) {
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

    if (sesa && first_name && last_name && person_no && user_name && password) {
      // user
      var sql =
        "INSERT INTO `elunch_users2`(`sesa_no`,`first_name`,`last_name`,`person_no`,`user_name`, `password`) VALUES ('" +
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

      db.query(sql, function(err, result) {
        user = result;

      });
    } else if (
      sesa &&
      supplier_name &&
      menu_no &&
      menu_desctription &&
      menu_price &&
      id_day
    ) {
      // menu
      var sql20 =
        "INSERT INTO `elunch_menu2` (`supplier_name`,`menu_no`,`menu_desctription`,`menu_price`, `id_day`) VALUES ('" +
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


      db.query(sql20, function(err, result) {
        res.json({ message: user, messageMenu: result });
      });
    }
  } else if (req.method == "GET") {

    //user
    var row = req.query.row;
    var sql17 = "SELECT * FROM `elunch_users2` WHERE `id` ='" + row + "'";
    db.query(sql17, function(err, results) {
      dataForUpdate = results;
    });

    var sql21 = "select * from elunch_menu2 WHERE 1 ORDER BY id DESC";
    db.query(sql21, function(err, results) {
      results2 = results;
    });

    // menu
    var row = req.query.row;
    var sql18 = "SELECT * FROM `elunch_menu2` WHERE `id` ='" + row + "'";
    db.query(sql18, function(err, results) {
      menuForUpdate = results;
    });

    var sql = "select * from elunch_users2 WHERE 1 ORDER BY id DESC";
    db.query(sql, function(err, result) {
      res.json({
        message: result,
        message2: results2,
        dataForUpdate: dataForUpdate,
        menuForUpdate: menuForUpdate
      });
    });
  } else if (req.method == "DELETE") {

    if (req.body.delete_id > 0) {
      var delete_id = req.body.delete_id;
      var sql7 = "DELETE FROM `elunch_users2` WHERE `id` ='" + delete_id + "'";
      db.query(sql7, function(err, results) {
      });
    }
    //menu
    if (req.body.delete_id3 > 0) {
      var mydelete_id3 = req.body.delete_id3;
      var sql37 =  "DELETE FROM `elunch_menu2` WHERE `id` ='" + mydelete_id3 + "'";
      db.query(sql37, function(err, results) {
      });
    }
  } else if (req.method == "PUT") {
  
    var sql13 =
      "UPDATE elunch_users2 SET sesa_no=" +
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

     db.query(sql13, function(err, result) {
    });

    var updateMenu = req.body.updateMenu;
    if (updateMenu == "updateMenu") {
      var myid2 = req.body.myid2;
      var supplier_name = req.body.supplier_name;
      var menu_no = req.body.menu_no;
      var menu_desctription = req.body.menu_desctription;
      var menu_price = req.body.menu_price;
      var id_day = req.body.id_day;

      var sql23 =
        "UPDATE elunch_menu2 SET supplier_name='" +
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

      db.query(sql23, function(err, result) {
      });
    }
    res.render("admin.ejs");
  }
};
//-------------------------------------users----------------------------------------------------
exports.users = function(req, res, next) {
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
    var menuForUpdate;
    var mypost = req.body.mypost;

    if (mypost == "mypost") {
      var sql21 = "select * from elunch_users2 WHERE 1 ORDER BY id DESC";
      db.query(sql21, function(err, results) {
        results2 = results;

        // users
        var row = req.body.row;
        if (row > 0) {
          var sql18 = "SELECT * FROM `elunch_users2` WHERE `id` ='" + row + "'";
          db.query(sql18, function(err, results) {
            menuForUpdate = results;
            res.json({ menuForUpdate: menuForUpdate });
          });
        } else {
          res.json({ message2: results2 });
          return;
        }
      });
    }
    if (req.body.addUsers == "addUsers") {
      var sesa = req.body.sesa_no;
      if (
        sesa &&
        first_name &&
        last_name &&
        person_no &&
        user_name &&
        password
      ) {
        // user
        var sql =
          "INSERT INTO `elunch_users2`(`sesa_no`,`first_name`,`last_name`,`person_no`,`user_name`, `password`) VALUES ('" +
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

        db.query(sql, function(err, result) {
          res.json({ message: result });
        });
      }
    }
  } else if (req.method == "GET") {
    res.render("users.ejs");
  } else if (req.method == "DELETE") {
    //user
    if (req.body.delete_id3 > 0) {
      var delete_id3 = req.body.delete_id3;
      var sql7 = "DELETE FROM `elunch_users2` WHERE `id` ='" + delete_id3 + "'";
      db.query(sql7, function(err, results) {
        console.log("Deleted row " + delete_id3);
      });
    }
  } else if (req.method == "PUT") {
   
    var sql13 =
      "UPDATE elunch_users2 SET sesa_no=" +
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

    db.query(sql13, function(err, result) {
    });

    var updateMenu = req.body.updateMenu;
    if (updateMenu == "updateUsers") {
      var myid2 = req.body.myid2;
      var supplier_name = req.body.supplier_name;
      var menu_no = req.body.menu_no;
      var menu_desctription = req.body.menu_desctription;
      var menu_price = req.body.menu_price;
      var id_day = req.body.id_day;

      var sql23 =
        "UPDATE elunch_users2 SET supplier_name='" +
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

      db.query(sql23, function(err, result) {
      });
    }
    res.render("users.ejs");
  }
};
//-------------------------------------menu----------------------------------------------------
exports.menu = function(req, res, next) {
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

    if (mypost == "mypost") {
      var menuForUpdate;
      var sql21 = "select * from elunch_menu2 WHERE 1 ORDER BY id DESC";
      db.query(sql21, function(err, results) {
        results2 = results;

        // menu
        var row = req.body.row;
        if (row > 0) {

          var sql18 = "SELECT * FROM `elunch_menu2` WHERE `id` ='" + row + "'";
          db.query(sql18, function(err, results) {
            menuForUpdate = results;
            res.json({ menuForUpdate: menuForUpdate });
          });
        } else {
          res.json({ message2: results2 });
          return;
        }
      });
    }
    if (req.body.addMenu == "addMenu") {
      console.log("jestem w ADDMenu");
      if (
        sesa &&
        supplier_name &&
        menu_no &&
        menu_desctription &&
        menu_price &&
        id_day
      ) {
        // menu
        var sql20 =
          "INSERT INTO `elunch_menu2` (`supplier_name`,`menu_no`,`menu_desctription`,`menu_price`, `id_day`) VALUES ('" +
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

        db.query(sql20, function(err, result) {
          res.json({ message: user, messageMenu: result });
        });
      }
    }
  } else if (req.method == "GET") {
    res.render("menu.ejs");
  } else if (req.method == "DELETE") {
    if (req.body.delete_id3 > 0) {
      var mydelete_id3 = req.body.delete_id3;
      var sql37 = "DELETE FROM `elunch_menu2` WHERE `id` ='" + mydelete_id3 + "'";
      db.query(sql37, function(err, results) {
        console.log("Deleted row " + mydelete_id3);
      });
    }
  } else if (req.method == "PUT") {
    var updateMenu = req.body.updateMenu;
    if (updateMenu == "updateMenu") {
      var myid2 = req.body.myid2;
      var supplier_name = req.body.supplier_name;
      var menu_no = req.body.menu_no;
      var menu_desctription = req.body.menu_desctription;
      var menu_price = req.body.menu_price;
      var id_day = req.body.id_day;

      var sql23 =
        "UPDATE elunch_menu2 SET supplier_name='" +
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

      db.query(sql23, function(err, result) {
      });
    }
    res.render("menu.ejs");
  }
};
// ------------------------------------guest---------------------------------------------------
exports.guest = function(req, res, next) {
  var userId = req.session.userId;
  if (userId == null) {
    res.redirect("/login");
    return;
  }

  if (req.method == "POST") {
    var mydate = req.body.my_date;
    var mysupplier = req.body.my_supplier;
    var menu_json, orders_json;
    var sesa_no1 = req.session.sesa_no1;
    
    // display menu
    mysupplier_name = mysupplier;
    var sql3 =
      "SELECT * FROM `elunch_menu2` WHERE `supplier_name`='" +
      mysupplier_name + "'";
    
    db.query(sql3, function(err, results) {
      menu_json = results;
    });

    // display current orders
    var sql1 =
      "SELECT elunch_gusets2.id, guest_name, who_order_sesa ,first_name, last_name, data, cost_center, departament, supplier, menu_no,menu_desctription, menu_price FROM elunch_users2 join elunch_gusets2 on elunch_users2.sesa_no = elunch_gusets2.who_order_sesa WHERE 1 ORDER BY id DESC";
 
    db.query(sql1, function(err, results) {
      res.json({
        table_data: results,
        table_supplier: menu_json,
        sesa_no1: sesa_no1
      });
    });
  } else if (req.method == "GET") {
    res.render("guest.ejs");
  } else if (req.method == "PUT") {
    const nodemailer = require("nodemailer");

    var supplier = req.body.supplier;
    var order_no;
    var sesa_no1 = req.body.sesa_no1;
    var order_date = req.body.order_date;
    var id = req.body.id;
    var guestName = req.body.guestName;
    var departament = req.body.departament;
    var cost_center = req.body.cost_center;
    var menu_no = req.body.menu_no;
    var menu_desctription = req.body.menu_desctription;
    var menu_price = req.body.menu_price;
    var emailTo;

    var smtpConfig = {
      host: "camtronic.nazwa.pl",
      port: 465,
      auth: {
        user: "elunchjs@camtronic.nazwa.pl",
        pass: "Rafal20!"
      }
    };
    var transporter = nodemailer.createTransport(smtpConfig);
   
    emailTo = email[departament];
    console.log("emailTo "+ emailTo)

    // in key to: put emailto in production version
    var mailOptions = {
      from: "elunchjs@camtronic.nazwa.pl",
      to: "rafal.zietak@se.com",
      subject: "Zamówienie Elunch (informacja generowana automatycznie)  ",
      text: "Cześć, " + "\n" + "Twój pracownik o nr. SESA "+ sesa_no1 + "\n" + "Zamówił obiad na dzień " + order_date + " od dostawcy " + supplier + " dla gościa: "+  guestName + "\n" + "Koszty obiadu obciążą twój MPK działu " + cost_center + " w kwocie " +  menu_price + " zł" + "\n" + "\n" + " Pozdrawia aplikacja Elunch" + "\n" +" dla Schneider Electric" +"\n"+ "\n" + " PS: to mail informacyjny, nie odpowiadamy na niego"
     
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    transporter.verify((err, success) => {
      if (err) console.error(err);
    });
    
    // console.log("Method: " + req.method);
    // console.log("put: ", sesa_no1, " ", supplier, " ", order_date, " ", "id ", id);

    //base id (previously order_no), get from menu order_name and order_price
    var sql6 = "SELECT * FROM `elunch_menu2` WHERE `id`='" + id + "'";
    // console.log("sql6: ", sql6);
    db.query(sql6, function(err, results) {
      if (results.length) {
        menu_desctription = results[0].menu_desctription;
        menu_price = results[0].menu_price;
        //return menu_desctription;
        menu_no = results[0].menu_no;
        //return menu_no;
      } else {
        message = "problem z pobraniem danych z bazy menu przed zapisem do bazy order2";
        res.render("index.ejs", { message: message });
      }

      // put order to DB
      var sql5 =
        "INSERT INTO `elunch_gusets2`(`guest_name`,`who_order_sesa`,`data`,`cost_center`,`departament`,`supplier`,`menu_no`, `menu_desctription`, `menu_price`) VALUES ('" +
        guestName +
        "','" +
        sesa_no1 +
        "','" +
        order_date +
        "','" +
        cost_center +
        "','" +
        departament +
        "','" +
        supplier +
        "','" +
        menu_no +
        "','" +
        menu_desctription +
        "','" +
        menu_price +
        "')";
      db.query(sql5, function(err, results) {
        console.log("Record inserted to DB");
      });
    });

    res.render("guest.ejs");
  } else if (req.method == "DELETE") {
    var delete_id3 = req.body.delete_id3;
    var sql7 = "DELETE FROM `elunch_gusets2` WHERE `id` ='" + delete_id3 + "'";

    db.query(sql7, function(err, results) {
      console.log("deleted row "+ delete_id3);
    });
  }
};
//-------------------------------------additional----------------------------------------------
exports.additional = function(req, res, next) {
  var userId = req.session.userId;
  if (userId == null) {
    res.redirect("/login");
    return;
  }
  if (req.method == "POST") {
    var mydate = req.body.my_date;
    var mysupplier = req.body.my_supplier;
    var sesa_no1 = req.session.sesa_no1;
    var menu_json, users_json;

    // display users sesa: name surname
    var sql27 = "select sesa_no, first_name, last_name  from elunch_users2 WHERE 1 ORDER BY id DESC";
    db.query(sql27, function(err, results) {
      users_json = results;
      // users
    });

    // display menu
    mysupplier_name = mysupplier;
    var sql3 = "SELECT * FROM `elunch_menu2` WHERE `supplier_name`='" + mysupplier_name + "'";
    db.query(sql3, function(err, results) {
      menu_json = JSON.stringify(results);
      //console.log("menu_json: ", menu_json);
    });

    var sql1 =
      "SELECT  elunch_orders2.id, Id_sesa_no ,first_name, last_name, order_date, order_supplier_name, order_no, order_name, order_price, founding, deduction FROM elunch_users2 join elunch_orders2 on elunch_users2.sesa_no = elunch_orders2.Id_sesa_no WHERE `order_date`='" +
      mydate +
      "' ORDER BY elunch_orders2.id DESC";

    db.query(sql1, function(err, results) {
      res.json({
        table_data: results,
        table_supplier: JSON.parse(menu_json),
        users_json: users_json
      });
    });
  } else if (req.method == "GET") {
    res.render("additional.ejs");
  } else if (req.method == "PUT") {
    var supplier = req.body.supplier;
    var order_no;
    var sesa_no1 = req.body.sesa_no1;
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
    
    //base id (previously order_no), get from menu order_name and order_price
    var sql6 = "SELECT * FROM `elunch_menu2` WHERE `id`='" + id + "'";

    db.query(sql6, function(err, results) {
      if (results.length) {
        menu_desctription = results[0].menu_desctription;
        menu_price = results[0].menu_price;
        //return menu_desctription;
        menu_no = results[0].menu_no;
        //return menu_no;

      } else {
        message = "problem z pobraniem danych z bazy menu przed zapisem do bazy order2";
        res.render("index.ejs", { message: message });
      }
      //
      var sql2 =
        "SELECT SUM(`founding`) FROM `elunch_orders2` WHERE `order_date` = '" +
        order_date +
        "' AND `Id_sesa_no`='" +
        sesa_no1 +
        "'";

      db.query(sql2, function(err, results) {
        sumOfFounding = results[0]["SUM(`founding`)"];
        console.log("SumOfFounding: " + sumOfFounding);
        if (sumOfFounding < 7) {
          founding = dailyFounding - sumOfFounding;
          deduction = menu_price - founding;
          console.log("founding :" + founding);
          console.log("deduction :" + deduction);
          if (menu_price <= 7) {
            founding = menu_price;
            console.log("founding1 :" + founding);
            console.log("deduction1 :" + deduction);
            if (sumOfFounding + founding >= 7) {
              var x = 7 - sumOfFounding;
              console.log("x: " + x);
              founding = x;
              console.log("founding2 :" + founding);
              console.log("deduction2 :" + deduction);
            }
            deduction = menu_price - founding;
            console.log("founding3 :" + founding);
            console.log("deduction3 :" + deduction);
          }
          if (deduction < 0) {
            deduction = 0;
          }
        } else {
          founding = 0;
          deduction = menu_price;
          console.log("founding4 :" + founding);
          console.log("deduction4 :" + deduction);
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

        db.query(sql5, function(err, results) {
          console.log("Record inserted to DB");
        });
      });
    });
    res.render("new_order2.ejs");
  } else if (req.method == "DELETE") {
    var delete_id = req.body.delete_id;
    var sql7 = "DELETE FROM `elunch_orders2` WHERE `id` ='" + delete_id + "'";
    db.query(sql7, function(err, results) {
      console.log("Delete row " + delete_id);
    });
  }
};
//-----------------------------------complaint-------------------------------------------------
exports.complaint = function(req, res, next) {
  res.render("complaint.ejs")
};
//------------------------------------upload---------------------------------------------------
exports.upload = function(req, res, next) {
  const nodemailer = require("nodemailer");
  var fs = require('fs');
  var emailSupplier = req.body.emailSupplier;
  var emailClient = req.body.emailClient;
  var emailText = req.body.emailText;
  // console.log("emailClient " + emailClient);
  // console.log("emailText " + emailText);
  // console.log("emailSupplier " + emailSupplier);

  var smtpConfig = {
    host: "camtronic.nazwa.pl",
    port: 465,
    auth: {
      user: "elunchjs@camtronic.nazwa.pl",
      pass: "Rafal20!"
    }     
  };
  var transporter = nodemailer.createTransport(smtpConfig);
  //console.log (" req.files " + req.files)
  //console.log (" req.files.photos " + req.files.sampleFile)

  if (!req.files || Object.keys(req.files).length === 0) {
    //return res.status(400).send('No files were uploaded.');
    // console.log(" without atachement");
      // in key to: put emailto in production version
    var mailOptions = {
      from: "elunchjs@camtronic.nazwa.pl",
      to: "rafal.zietak@se.com",
      subject: "Reklamacja" ,
      text: emailText
    };

    transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    transporter.verify((err, success) => {
    if (err) console.error(err);
      // console.log("Your config is correct");
    });
  
    res.render("new_order2.ejs")
    return
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('public/uploads/filename.jpg', function(err) {
    if (err)
      return res.status(500).send(err);
    // console.log ("File uploaded!");
 
  });
  
  // in key to: put emailto in production version
  var mailOptions = {
    from: "elunchjs@camtronic.nazwa.pl",
    to: "rafal.zietak@se.com",
    subject: "Reklamacja"  ,
    attachments: [
      {   // stream as an attachment
      filename: 'zdjęcie.jpg',
      path: 'public/uploads/filename.jpg'
      }
    ],
    text: emailText
  };

  transporter.sendMail(mailOptions, function(error, info) {
  if (error) {
    console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  transporter.verify((err, success) => {
  if (err) console.error(err);
    // console.log("Your config is correct");
  });
 
  res.render("new_order2.ejs")
};