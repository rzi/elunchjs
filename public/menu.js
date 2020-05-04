window.onload = function () {
  var $tableMenu = $("#tableMenu");

  // Make a request for a user with a given ID
  axios
    .post("/home/menu", {
      mypost: "mypost"
    })
    .then(function (response) {
      // handle success
      var menu = response.data.message2;
      $tableMenu.bootstrapTable('destroy');
      $tableMenu.bootstrapTable({
        data: menu,
        columns: [, , , , , ,
          {
            field: 'delete1',
            title: 'Usuń',
            align: 'center',
            clickToSelect: false,
            events: window.operateEvents3,
            formatter: operateFormatter3
          }, {
            field: 'update1',
            title: 'Uaktualnij',
            align: 'center',
            clickToSelect: true,
            events: window.operateEvents4,
            formatter: operateFormatter4
          }
        ]
      });
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });

  function updateRow2(row) {
    axios
      .post("/home/menu", {
        row: row,
        mypost: "mypost"
      })
      .then(function (response) {
        // handle success
        // console.log("len menuForUpdate: " + response.data.menuForUpdate[0])
        // console.log(response.data.menuForUpdate[0].id);
        document.getElementById("myid2").value = response.data.menuForUpdate[0].id;
        document.getElementById("supplier_name").value = response.data.menuForUpdate[0].supplier_name;
        document.getElementById("menu_no").value = response.data.menuForUpdate[0].menu_no;
        document.getElementById("menu_desctription").value = response.data.menuForUpdate[0].menu_desctription;
        document.getElementById("menu_price").value = response.data.menuForUpdate[0].menu_price;
        document.getElementById("id_day").value = response.data.menuForUpdate[0].id_day;

        document.getElementById("btn_update_menu").style.display = "inline";
        document.getElementById("btn_add_menu").style.display = "none";
        //location.reload();                            
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });

  }
  window.operateEvents3 = {
    "click .remove": function (e, value, row, index) {
      $tableMenu.bootstrapTable("remove", {
        field: "id",
        values: [row.id]
      })
      myFunction_delete3(row.id);
    }
  };
  window.operateEvents4 = {
    "click .update": function (e, value, row, index) {
      updateRow2(row.id);
    }
  }
  //resetMenu 
  var resteConfirm;
document.getElementById("resetMenu").addEventListener("click",function() {
  if (confirm("czy chcesz wyzerować dane?")){
    // alert("OK");
    axios
    .put("/home/menu", {
      updateMenu: "resetMenu",
    })
    .then(function (response) {
      // handle success
      location.reload();
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });

  }
   
  });
} //end of onload

function addMenu1() {
  var supplier_name = document.getElementById("supplier_name").value
  if (supplier_name == "Opoka" || supplier_name == "Mucha") {
    //
  } else {
    alert(" Wprowadź poprawną nazwę dostawcy zaczynająć od WIELKIEJ pierwszej litery \n Możliwe nazwy to: Opoka i Mucha")
    document.getElementById("supplier_name").value = ""
    return
  }
  if (document.getElementById("supplier_name").value == "" ||
    document.getElementById("menu_no").value == "" || document.getElementById("menu_desctription").value == "" ||
    document.getElementById("menu_price").value == "" || document.getElementById("id_day").value == "") {
    alert("uzupełnij wszystkie pola");
    return
  }
  axios
    .post("/home/menu", {
      addMenu: "addMenu",
      supplier_name: document.getElementById("supplier_name").value,
      menu_no: document.getElementById("menu_no").value,
      menu_desctription: document.getElementById("menu_desctription").value,
      menu_price: document.getElementById("menu_price").value,
      id_day: document.getElementById("id_day").value
    })
    .then(function (response) {
      location.reload();
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
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
    '<a class="update" href="javascript:void(0)" title="Uaktualnij">',
    '<i class="fa fa-refresh fa-spin"></i>',
    "</a>"
  ].join("");
}
function myFunction_delete3(value) {
  var delete_id3 = value;
  // Make a request for a user with a given ID
  axios
    .delete("/home/menu", {
      data: {
        delete_id3: delete_id3
      }
    })
    .then(function (response) {
      // handle success
      location.reload();
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
}
function updateMenuDB1() {
  var supplier_name = document.getElementById("supplier_name").value
  if (supplier_name == "Opoka" || supplier_name == "Mucha") {
    //
  } else {
    alert(" Wprowadź poprawną nazwę dostawcy zaczynająć od WIELKIEJ pierwszej litery \n Możliwe nazwy to: Opoka i Mucha")
    document.getElementById("supplier_name").value = ""
    return
  }
  if (document.getElementById("myid2").value == "" || document.getElementById("supplier_name").value == "" ||
    document.getElementById("menu_no").value == "" || document.getElementById("menu_desctription").value == "" ||
    document.getElementById("menu_price").value == "" || document.getElementById("id_day").value == "") {
    alert("uzupełnij wszystkie pola");
    return
  }

  axios
    .put("/home/menu", {
      updateMenu: "updateMenu",
      myid2: document.getElementById("myid2").value,
      supplier_name: document.getElementById("supplier_name").value,
      menu_no: document.getElementById("menu_no").value,
      menu_desctription: document.getElementById("menu_desctription").value,
      menu_price: document.getElementById("menu_price").value,
      id_day: document.getElementById("id_day").value
    })
    .then(function (response) {
      // handle success
      location.reload();
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });

}
function validateSupplier() {
  var supplier_name = document.getElementById("supplier_name").value
  if (supplier_name == "Opoka" || supplier_name == "Mucha") {
    //
  } else {
    alert(" Wprowadź poprawną nazwę dostawcy zaczynająć od WIELKIEJ pierwszej litery \n Możliwe nazwy to: Opoka i Mucha")
    document.getElementById("supplier_name").value = ""
    return
  }
}