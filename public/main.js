// Client side js

window.onload = function() {
  var $table = $("#table");
  var $table_mucha = $("#table_mucha");
  var $table_opoka = $("#table_opoka");
  var $remove = $("#remove");
  var selections = [];
  var fname, sesa_no1; 
  $("#locale").change(function() {
    $table.bootstrapTable("refreshOptions", {
      locale: $(this).val()
    });
  }); 
  // Make a request for a user with a given ID
  axios
    .post("/home/new_order2", {
      my_date: document.getElementById("lunch_order").value,
      my_supplier: document.getElementById("activeSupplier").innerText
    })
    .then(function(response) {
      // handle success
      fname = response.data.fname;
      setCookie("name", fname, 1);
      lname = response.data.lname;
      setCookie("surname", lname, 1);
      sesa_no1 = response.data.sesa_no1;
      setCookie("sesa", sesa_no1, 1);
      // console.log ("fname: "+ fname + "sesa_no1: " + sesa_no1);
      document.getElementById("fname").innerText ="Witaj "+fname + ",";
      document.getElementById("sesa_no1").innerText = sesa_no1;
      var table_data = response.data.table_data;
      var table_data2 = JSON.stringify(table_data );
      // console.log("table_data: " + table_data2 );
      $table.bootstrapTable('destroy');
      $table.bootstrapTable({ data: table_data,
        columns: [,,,,,,,,,,,
        {
          field: 'operate',
          title: 'Usuń',
          align: 'center',
          clickToSelect: false,
          events: window.operateEvents,
          formatter: operateFormatter
        }]     
      });
      var table_supplier = response.data.table_supplier;
      var table_supplier1 = JSON.stringify(table_supplier );
      // console.log("table_supplier1: " + table_supplier1);
      $table_mucha.bootstrapTable('destroy');
      $table_mucha.bootstrapTable({data: table_supplier,
        columns: [,,,,,
        {
          field: 'order',
          title: 'Zamów',
          align: 'center',
          clickToSelect: false,
          events: window.operateEvents2,
          formatter: operateFormatter2
        }]
      });
      $table_opoka.bootstrapTable('destroy');
      $table_opoka.bootstrapTable({data: table_supplier,
        columns: [,,,,,
        {
          field: 'order',
          title: 'Zamów',
          align: 'center',
          clickToSelect: false,
          events: window.operateEvents2,
          formatter: operateFormatter2
        }]              
      });
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    })
    .finally(function() {
      // always executed
    });
// Functions    
    window.operateEvents = {
      "click .remove": function(e, value, row, index) {
        if (document.getElementById("f").innerText == "1"){
          $table.bootstrapTable("remove", {
          field: "id",
          values: [row.id]
        });
        myFunction_delete2(row.id);
        } else{
          alert( "Nie możesz zamówić ani uswać na wybrany dzień. \n Zamówienia można składać online do 9:00 lub telefonicznie");
        }
      }
    };
};
// Koniec funkcji

const spanH = document.querySelector("span.h");
const spanM = document.querySelector("span.m");
const spanS = document.querySelector("span.s");
const spanF = document.querySelector("span.f");
var endTime, endTime, now, today, tommorow, day, month;

// Get today date in the format YYYY-MM-DD
now = new Date();
day = ("0" + now.getDate()).slice(-2);
month = ("0" + (now.getMonth() + 1)).slice(-2);
today = now.getFullYear() + "-" + month + "-" + day;
//console.log("today: " + today);

// Take date from datepicker, if empty take from cookies
var mydatePicker = document.getElementById("lunch_order");
if (getCookie("date")) {
  mydatePicker.value = getCookie("date");
} else {
  mydatePicker.value = today;
  setCookie("date" , today);
}
//console.log("datePicker: " + mydatePicker.value);

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
// console.log("supplier: " + my_supplier);

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
  location.reload();
});

// to define yesterday date in timestamp format
var myhour = now.getHours();
var y_currentDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
var y_day = y_currentDate.getDate();
y_day = y_day < 10 ? "0" + y_day : y_day;
var y_month = ("0" + (y_currentDate.getMonth() + 1)).slice(-2);
var y_year = y_currentDate.getFullYear();
yesterday = y_year + "-" + y_month + "-" + y_day + "T00:00:01";
var yesterdayTimeStampe = Date.parse(yesterday) / 1000;
// console.log("yesterdayTimeStampe: " + yesterdayTimeStampe);



// to define tommorow date in timestamp format
var t_currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); //tommorow
var t_day = t_currentDate.getDate();
t_day = t_day < 10 ? "0" + t_day : t_day;
var t_month = ("0" + (t_currentDate.getMonth() + 1)).slice(-2);
var t_year = t_currentDate.getFullYear();
tommorow = t_year + "-" + t_month + "-" + t_day + "T00:00:00";
var tommorowAt00TimeStamp = Date.parse(tommorow) / 1000;
// console.log("tommorowAt00TimeStamp: " + tommorowAt00TimeStamp);
setInterval(() => {
  // take current value of datapicker  YYYY-MM-DD, 00:00:00
  var datePickerValue = document.getElementById("lunch_order").value;
  var parts = datePickerValue.split("-");
  parts[3] = 0;
  parts[4] = 0;
  parts[5] = 0;
  var mydate1 = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5] );

  var pickerAt00TimeStamp = Date.parse(mydate1) / 1000;
  // console.log("pickerAt00TimeStamp " + " " + mydate1.toLocaleString());
  nowTime1 = new Date(); //.getTime();
  // console.log ("nowTime " +  nowTime1.toLocaleString())
  nowTime = Math.floor(nowTime1 / 1000); //timestamp format
  // console.log ("nowTimeTimeStamp " +  nowTime);
  var todayAt00 = Date.parse(today + "T00:00:00") / 1000;
  // console.log("todayAt00: " + todayAt00);
  var todayAt10 = today + "T09:00:00";
  // console.log("todayAt10: " + todayAt10);
  var todayAt10TimeStamp = Date.parse(todayAt10) / 1000;

  if (
    (pickerAt00TimeStamp >= todayAt00 &&
      nowTime >= pickerAt00TimeStamp &&
      nowTime < todayAt10TimeStamp) ||
    pickerAt00TimeStamp >= tommorowAt00TimeStamp
  ) {
    // console.log("mogę zamawiać i usuwać");
    document.getElementById("f").innerText = "1";
    document.getElementById("mesg").innerText = " ";
  } else {
    // console.log("Nie moge zamówić ani usuwać");
    document.getElementById("f").innerText = "0";
    document.getElementById("mesg").innerText =
      " *nie mozna zamówić ani usuwać na wybrany dzień";
  }

  if (nowTime >= todayAt00 && nowTime <= todayAt10TimeStamp) {
    // document.getElementById("myClock").innerText=" aaaaaaaa";
  } else {
    document.getElementById("myClock").innerText = "";
  }

  if (myhour < 10) {
    // console.log("today: " + today);
    var todayAt10 = today + "T09:00:00";
    endTime = Date.parse(todayAt10) / 1000;
  } else {
    endTime = tommorowAt00TimeStamp;
  }

  var mytime = endTime - nowTime;
 
  console.log("pozostały czas do zamowienia: " + mytime);
  let hours = Math.floor((endTime / (60 * 60) - nowTime / (60 * 60)) % 24);
  // Przykład - dodanie 0 przeg godziną
  hours = hours < 10 ? `0${hours}` : hours;
  let minutes = Math.floor((endTime / 60 - nowTime / 60) % 60);
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const secs = Math.floor((endTime - nowTime) % 60);
  if (mytime > 0) {
    // document.getElementById("f").innerText="1";
  } else {
    // document.getElementById("f").innerText="0";
    location.reload();
  }
  hours > 0 ? (spanH.textContent = hours) : (spanH.textContent = 0);
  minutes > 0 ? (spanM.textContent = minutes) : (spanM.textContent = 0);
  secs > 0 ? (spanS.textContent = secs) : (spanS.textContent = 0);
}, 1000);

// Functions
function myFunction_order2(value) {
  // Make a request for a user with a given ID
  axios
    .put("/home/new_order2", {
      sesa_no1: document.getElementById("sesa_no1").innerText,
      supplier: document.getElementById("activeSupplier").innerText,
      order_date: document.getElementById("lunch_order").value,
      id: value
    })
    .then(function(response) {
      // handle success
      // var $table4 = $('#myorders_list');
      // $table4.bootstrapTable('refresh');
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
    if (document.getElementById("f").innerText == "1"){
      myFunction_order2(row.id);// CHANGE STRATEGY FROM MENU_NO TO ID
    } else{
      alert( "Nie możesz zamówić na wybrany dzień. \n Zamówienia można składać online do 10:00 lub telefonicznie");
    }    
    
  }
};

function resetMenu (){
  alert("resetMenu");

};
