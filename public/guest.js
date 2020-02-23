
var $tableMenu = $("#tableMenu");
var $table_mucha = $("#table_mucha");
var $table_opoka = $("#table_opoka");
var $table = $("#table");
var sesa_no1;

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
  setCookie("date", my_date1, 1);
  //sendDate(my_date1);
});
 
  // Make a request for a user with a given ID
    axios
     .post("/home/guest", {
        mypost: "mypost" ,
        my_supplier: document.getElementById("activeSupplier").innerText     
      })
      .then(function(response) {
        // handle success
        sesa_no1 = response.data.sesa_no1;
        console.log("sesa_no1: " + sesa_no1 );
        document.getElementById("sesa_no1").innerText = sesa_no1;
        var table_data = response.data.table_data;
        var table_data2 = JSON.stringify(table_data );
        console.log("table_data: " + table_data2 );
        $table.bootstrapTable('destroy');
        $table.bootstrapTable({ data: table_data,
          columns: [,,,,,,,,,,
              {
                field: 'operate',
                title: 'Usuń',
                align: 'center',
                clickToSelect: false,
                events: window.operateEvents3,
                formatter: operateFormatter3
              }]     
            });

            var table_supplier = response.data.table_supplier;
            var table_supplier1 = JSON.stringify(table_supplier );
            console.log("table_supplier1: " + table_supplier1);
            $table_mucha.bootstrapTable('destroy');
            $table_mucha.bootstrapTable({data: table_supplier,
              columns: [,,,,,
              {
                field: 'order',
                title: 'Zamów',
                align: 'center',
                clickToSelect: false,
                events: window.operateEvents4,
                formatter: operateFormatter4
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
                events: window.operateEvents4,
                formatter: operateFormatter4
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

      //   var table_supplier = response.data.table_supplier;
      //   var table_supplier1 = JSON.stringify(table_supplier );
      //   console.log("table_supplier1: " + table_supplier1);
      //   $tableMenu.bootstrapTable('destroy');
      //   $tableMenu.bootstrapTable({data: table_supplier,
      //         columns: [,,,,,
      //         {
      //           field: 'order',
      //           title: 'Zamów',
      //           align: 'center',
      //           clickToSelect: false,
      //           events: window.operateEvents4,
      //           formatter: operateFormatter4
      //         }]
      //        });                               
      // })
      // .catch(function(error) {
      //   // handle error
      //    console.log(error);
      // })
      // .finally(function() {
      //   // always executed
      // });  
  function updateRow2(row){
    console.log( " update " + row)
    axios
      .post("/home/menu", {
          row: row,
          mypost:"mypost"       
      })
      .then(function(response) {
        // handle success
        console.log("len menuForUpdate: "+ response.data.menuForUpdate[0])
        console.log(response.data.menuForUpdate[0].id);
        document.getElementById("myid2").value=response.data.menuForUpdate[0].id;
        document.getElementById("supplier_name").value=response.data.menuForUpdate[0].supplier_name;
        document.getElementById("menu_no").value=response.data.menuForUpdate[0].menu_no;
        document.getElementById("menu_desctription").value=response.data.menuForUpdate[0].menu_desctription;
        document.getElementById("menu_price").value=response.data.menuForUpdate[0].menu_price;
        document.getElementById("id_day").value=response.data.menuForUpdate[0].id_day;
                 
        document.getElementById("btn_update_menu").style.display = "inline";
        document.getElementById("btn_add_menu").style.display = "none";
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
  window.operateEvents3 = {
    "click .remove": function(e, value, row, index) {
      $table.bootstrapTable("remove", {
      field: "id",
      values: [row.id] 
      })
      myFunction_delete3(row.id);        
    }
  }; 
  window.operateEvents4 = {
    "click .order": function(e, value, row, index) {
      var guestName = document.getElementById("guestName");
      var result = guestName.value;
      var department = document.getElementById("department");
      var result2 = department.options[department.selectedIndex].value;
      if (result == "" || result2 == "empty"){
        alert( "Musisz wpisać imię i nazwisko gościa \n wybrać dział do kogo gość przyjechał i datę");
      } else{
        myFunction_guest2(row.id,row.supplier_name,row.menu_no,row.menu_desctription,row.menu_price);// CHANGE STRATEGY FROM MENU_NO TO ID
      }      
    }
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
  

 function operateFormatter2(value, row, index) {
  return [
    '<a class="order" href="javascript:void(0)" title="Zamów">',
    '<i class="fas fa-utensils"></i>',
    "</a>"
  ].join("");
}
function addMenu1(){
    axios
    .post("/home/menu", {
      addMenu:"addMenu",
      supplier_name: document.getElementById("supplier_name").value,
      menu_no: document.getElementById("menu_no").value,
      menu_desctription: document.getElementById("menu_desctription").value,
      menu_price: document.getElementById("menu_price").value,
      id_day: document.getElementById("id_day").value
    })
    .then(function(response) {
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
function operateFormatter3(value, row, index) {
  return [
    '<a class="remove" href="javascript:void(0)" title="Usuń">',
    '<i class="fa fa-trash"></i>',
    "</a>"
  ].join("");
}
function operateFormatter4(value, row, index) {
  return [
    '<a class="order" href="javascript:void(0)" title="Zamów">',
    '<i class="fas fa-utensils"></i>',
    "</a>"
  ].join("");
}  
function myFunction_delete3(value) {
  var delete_id3 = value;
  // Make a request for a user with a given ID
  axios
    .delete("/home/guest", {
      data: {
        delete_id3: delete_id3
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
function updateMenuDB1(){
  console.log( " updateDB ")
      axios
      .put("/home/menu", {
          updateMenu: "updateMenu",
          myid2: document.getElementById("myid2").value,
          supplier_name:document.getElementById("supplier_name").value,
          menu_no:document.getElementById("menu_no").value,
          menu_desctription:document.getElementById("menu_desctription").value,
          menu_price:document.getElementById("menu_price").value,
          id_day:document.getElementById("id_day").value  
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
function myFunction_guest2(value,supplier,menu_no,menu_desctription,menu_price) {
  // Make a request for a user with a given ID
  axios
    .put("/home/guest", {
      sesa_no1: document.getElementById("sesa_no1").innerText,
      supplier: supplier,
      order_date: document.getElementById("lunch_order").value,
      id: value,
      guestName: document.getElementById("guestName").value,
      departament: document.getElementById("department").options[department.selectedIndex].value,
      cost_center: document.getElementById("department").options[department.selectedIndex].text,
      menu_no:menu_no,
      menu_desctription:menu_desctription,
      menu_price:menu_price
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