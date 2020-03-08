// Client side js
window.onload = function() {
  var $table = $("#table");
  var $table_mucha = $("#table_mucha");
  var $table_opoka = $("#table_opoka");
  var $remove = $("#remove");
  var selections = [];
  var fname, sesa_no1;

  // Make a request for a user with a given ID
  axios
    .post("/home/additional", {
      my_date: document.getElementById("lunch_order").value,
      my_supplier: document.getElementById("activeSupplier").innerText
    })
    .then(function(response) {
      // handle success
      var userDB = document.getElementById("userDB");
      var users_json = response.data.users_json;
      var users_json2 = JSON.stringify(users_json);
      //console.log("users_json: " + users_json2);
      var j=1;
      for (let i=0; i< users_json.length; i++) {
        var el = users_json[i].sesa_no;
        var listName =users_json[i].first_name + " " + users_json[i].last_name ;
        var o= document.createElement("option");
        o.text = listName;
        o.value = el;
        document.getElementById("userDB").add(o);            
      }

      var table_data = response.data.table_data;
      var table_data2 = JSON.stringify(table_data);
      //console.log("table_data: " + table_data2);
      $table.bootstrapTable("destroy");
      $table.bootstrapTable({
        data: table_data,
        columns: [
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          ,
          {
            field: "operate",
            title: "Usuń",
            align: "center",
            clickToSelect: false,
            events: window.operateEvents,
            formatter: operateFormatter
          }
        ]
      });
      var table_supplier = response.data.table_supplier;
      var table_supplier1 = JSON.stringify(table_supplier);
      //console.log("table_supplier1: " + table_supplier1);
      $table_mucha.bootstrapTable("destroy");
      $table_mucha.bootstrapTable({
        data: table_supplier,
        columns: [
          ,
          ,
          ,
          ,
          ,
          {
            field: "order",
            title: "Zamów",
            align: "center",
            clickToSelect: false,
            events: window.operateEvents2,
            formatter: operateFormatter2
          }
        ]
      });
      $table_opoka.bootstrapTable("destroy");
      $table_opoka.bootstrapTable({
        data: table_supplier,
        columns: [
          ,
          ,
          ,
          ,
          ,
          {
            field: "order",
            title: "Zamów",
            align: "center",
            clickToSelect: false,
            events: window.operateEvents2,
            formatter: operateFormatter2
          }
        ]
      });
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    })
    .finally(function() {
      // always executed
    });


  window.operateEvents = {
    "click .remove": function(e, value, row, index) {
      $table.bootstrapTable("remove", {
        field: "id",
        values: [row.id]
      });
      myFunction_delete2(row.id);
    }
  };


};
// Koniec funkcj

// Get today date in the format YYYY-MM-DD
now = new Date();
day = ("0" + now.getDate()).slice(-2);
month = ("0" + (now.getMonth() + 1)).slice(-2);
today = now.getFullYear() + "-" + month + "-" + day;

// Take date from datepicker, if empty take from cookies
var mydatePicker = document.getElementById("lunch_order");

if (getCookie("date")) {
  mydatePicker.value = getCookie("date");
} else {
  mydatePicker.value = today;
  setCookie("date" , today);
}
// Get supplier, if empty initlal is Mucha, set active supplier
var my_supplier = document.getElementById("activeSupplier").innerText;
if (my_supplier == "" || my_supplier == undefined) {
  my_supplier = getCookie("supplier");
  if (!my_supplier || my_supplier == "") {
    my_supplier = "Mucha";
  }
  document.getElementById("activeSupplier").innerText = my_supplier;
  setCookie("supplier", my_supplier, 1);
}

if (my_supplier == "Mucha") {
  // activaTab("mucha");
  var tab= "mucha";
  $('.nav-tabs a[href="#' + tab + '"]').tab("show");
} else {
  // activaTab("opoka");
  var tab1= "opoka";
  $('.nav-tabs a[href="#' + tab1 + '"]').tab("show");
}

var my_date = document.getElementById("lunch_order").value;
// Swetch between suppliers, using cookies to not forget
$('a[data-toggle="tab"]').on("shown.bs.tab", function(e) {
  document.getElementById("activeSupplier").innerText = e.target.innerHTML;
  my_supplier = e.target.innerHTML;
  setCookie("supplier", my_supplier, 1);
  location.reload();
});

// change order date and dont allowed to chose date from past
document.getElementById("lunch_order").addEventListener("change", function() {
  var my_date1 = document.getElementById("lunch_order").value;
  var my_datePicker = new Date(my_date1).getTime();
  var my_dateCurrent = new Date(today).getTime();
  if (my_datePicker >= my_dateCurrent) {
    setCookie("date", my_date1, 1);
    // alert ("OK");
  } else {
    alert("Nie możesz zamowić obiadu wstecz!");
    document.getElementById("lunch_order").value = today;
    setCookie("date", today, 1);
    my_date1 = today;
  }  
});
// Funkcje
function myFunction_order2(value,user) {
  // Make a request for a user with a given ID
  axios
    .put("/home/additional", {
      sesa_no1: user,
      supplier: document.getElementById("activeSupplier").innerText,
      order_date: document.getElementById("lunch_order").value,
      id: value
    })
    .then(function(response) {
      // handle success
      location.reload();
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    })
    .finally(function() {
      // always executed
    });
}
function myFunction_delete2(value) {
  var delete_id = value;
  // Make a request for a user with a given ID
  axios
    .delete("/home/additional", {
      data: {
        delete_id: delete_id
      }
    })
    .then(function(response) {
      // handle success
      location.reload();
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    })
    .finally(function() {
      // always executed
    });
}
function setCookie(cname, cvalue, exdays) {
  //declares the value of dt as current date
  var dt = new Date();
  dt.setTime(dt.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + dt.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}
function operateFormatter(value, row, index) {
  return [
    '<a class="remove" href="javascript:void(0)" title="Usuń">',
    '<i class="fa fa-trash"></i>',
    "</a>"
  ].join("");
}
function operateFormatter2(value, row, index) {
  return [
    '<a class="order" href="javascript:void(0)" title="Zamów">',
    '<i class="fas fa-utensils"></i>',
    "</a>"
  ].join("");
}
window.operateEvents2 = {
  "click .order": function(e, value, row, index) {
    var userDB = document.getElementById("userDB");
    var result = userDB.options[userDB.selectedIndex].value;
    if (result == "empty") {
      alert ("Musisz wybrać dla kogo zamawiasz obiad")
      return
    }
    // var result2 = userDB.options[userDB.selectedIndex].text;
    myFunction_order2(row.id, result); // CHANGE STRATEGY FROM MENU_NO TO ID
  }
};
// Koniec funkcji
