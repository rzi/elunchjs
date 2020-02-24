// Client side js

// Get today date in the format YYYY-MM-DD
now = new Date();
day = ("0" + now.getDate()).slice(-2);
month = ("0" + (now.getMonth() + 1)).slice(-2);
today = now.getFullYear() + "-" + month + "-" + day;
console.log("today: " + today);

// Take date from datepicker, if empty take from cookies
var mydatePicker = document.getElementById("lunch_order");

if (getCookie("date")) {
  mydatePicker.value = getCookie("date");
} else {
  mydatePicker.value = today;
  setCookie("date" , today);
}
console.log("datePicker: " + mydatePicker.value);

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

console.log("supplier: " + my_supplier);

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
  console.log("supplier: " + getCookie("supplier"));
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
  sendDate(my_date1);
});

// Funkcje
function sendSupplier(supplier, mydate1) {
  // Make a request for a user with a given ID
  axios
    .get("/home/new_order?supplier=" + supplier + "&mydate=" + mydate1)
    .then(function(response) {
      // handle success
      // console.log(response.data);
      // location.reload();
      //location.reload();
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    })
    .finally(function() {
      // always executed
    });
}
function sendDate(mydate) {
  // Make a request for a user with a given ID
  axios
    .get("/home/new_order?mydate=" + mydate)
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
function myFunction_order(value) {
  // Make a request for a user with a given ID
  axios
    .post("/home/new_order", {
      sesa_no1: document.getElementById("sesa_no1").innerText,
      supplier: document.getElementById("activeSupplier").innerText,
      order_date: document.getElementById("lunch_order").value,
      id: value
    })
    .then(function(response) {
      // handle success
      // var $table4 = $('#myorders_list');
      // $table4.bootstrapTable('refresh');
      //location.reload();
      //console.log(response);
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    })
    .finally(function() {
      // always executed
    });
}
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
      console.log(response);
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    })
    .finally(function() {
      // always executed
    });
}
function myFunction_delete(value) {
  var delete_id = value;
  // Make a request for a user with a given ID
  axios
    .delete("/home/new_order", {
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
function myFunction_delete2(value) {
  var delete_id = value;
  // Make a request for a user with a given ID
  axios
    .delete("/home/new_order2", {
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
function myFunction_calendar(today) {
  alert("calendar change: " + document.getElementById("lunch_order").value);

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
// Koniec funkcji
