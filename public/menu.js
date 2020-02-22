window.onload = function() {
    var $table = $("#table");
    var $tableMenu = $("#tableMenu");
    var $myid =$("#myid");
    
    // Make a request for a user with a given ID
        axios
          .get("/home/menu", {
            myget: "myget"
            
          })
          .then(function(response) {
            // handle success
            var users = response.data.message;
            console.log ("users: " + users);
            var users2 = JSON.stringify(users);
            console.log("users2: " + users2 );
            $table.bootstrapTable('destroy');
            $table.bootstrapTable({ data: users,
                columns: [,,,,,,,
                    {
                      field: 'delete',
                      title: 'Usuń',
                      align: 'center',
                      clickToSelect: false,
                      events: window.operateEvents,
                      formatter: operateFormatter
                    },{
                        field: 'update',
                        title: 'Uaktualnij',
                        align: 'center',
                        clickToSelect: true,
                        events: window.operateEvents2,
                        formatter: operateFormatter2
                      }]            
            });   

            var menu = response.data.message2;
            console.log ("menu: " + menu);
            var menu2 = JSON.stringify(menu);
            console.log("menu2: " + menu2 );
            $tableMenu.bootstrapTable('destroy');
            $tableMenu.bootstrapTable({ data: menu ,
                columns: [,,,,,,
                    {
                      field: 'delete',
                      title: 'Usuń',
                      align: 'center',
                      clickToSelect: false,
                      events: window.operateEvents3,
                      formatter: operateFormatter3
                    },{
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
          .catch(function(error) {
            // handle error
            console.log(error);
          })
          .finally(function() {
            // always executed
          }); 
          function updateRow(row){
            console.log( " update " + row)
                axios
                .get("/home/admin", {
                  params: {
                    row: row
                  }
                 
                })
                .then(function(response) {
                  // handle success
                    document.getElementById("myid").value=response.data.dataForUpdate[0].id;
                    document.getElementById("sesa_no").value=response.data.dataForUpdate[0].sesa_no;
                    document.getElementById("first_name").value=response.data.dataForUpdate[0].first_name;
                    document.getElementById("last_name").value=response.data.dataForUpdate[0].last_name;
                    document.getElementById("user_name").value=response.data.dataForUpdate[0].user_name;
                    document.getElementById("mob_no").value=response.data.dataForUpdate[0].mob_no;
                    document.getElementById("password").value=response.data.dataForUpdate[0].password;
                    document.getElementById("btn_update").style.display = "block";
                    document.getElementById("btn_add").style.display = "none";

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
          function updateRow2(row){
            console.log( " update " + row)
                axios
                .get("/home/admin", {
                  params: {
                    row: row
                  }
                 
                })
                .then(function(response) {
                  // handle success
 
                  console.log("len menuForUpdate: "+ response.data.menuForUpdate[0].id)
                  console.log(response.data.menuForUpdate[0].id);
                    document.getElementById("myid2").value=response.data.menuForUpdate[0].id;
                    document.getElementById("supplier_name").value=response.data.menuForUpdate[0].supplier_name;
                    document.getElementById("menu_no").value=response.data.menuForUpdate[0].menu_no;
                    document.getElementById("menu_desctription").value=response.data.menuForUpdate[0].menu_desctription;
                    document.getElementById("menu_price").value=response.data.menuForUpdate[0].menu_price;
                    document.getElementById("id_day").value=response.data.menuForUpdate[0].id_day;
                    
                    document.getElementById("btn_update_menu").style.display = "block";
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
          window.operateEvents = {
            "click .remove": function(e, value, row, index) {
                $table.bootstrapTable("remove", {
                field: "id",
                values: [row.id] 
                })
                myFunction_delete2(row.id);        
            }
          }; 
          window.operateEvents2 = {
            "click .update": function(e, value, row, index) {
              updateRow(row.id); 
            }
          }
          window.operateEvents3 = {
            "click .remove": function(e, value, row, index) {
                $tableMenu.bootstrapTable("remove", {
                field: "id",
                values: [row.id] 
                })
                myFunction_delete3(row.id);        
            }
          }; 
          window.operateEvents4 = {
            "click .update": function(e, value, row, index) {
              updateRow2(row.id); 
            }
          }
               
} //end of onload

function addMenu1(){
    axios
    .post("/home/menu", {
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
function addUser1(){
  axios
  .post("/home/menu", {
    sesa_no: document.getElementById("sesa_no").value,
    first_name: document.getElementById("first_name").value,
    last_name: document.getElementById("last_name").value,
    mob_no: document.getElementById("mob_no").value,
    user_name: document.getElementById("user_name").value,
    password: document.getElementById("password").value      
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
function operateFormatter(value, row, index) {
    return [
      '<a class="remove" href="javascript:void(0)" title="Usuń">',
      '<i class="fa fa-trash"></i>',
      "</a>"
    ].join("");
}
function operateFormatter2(value, row, index) {
    return [
      '<a class="update" href="javascript:void(0)" title="Uaktualnij">',
      '<i class="fa fa-refresh fa-spin"></i>',
      "</a>"
    ].join("");
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
function myFunction_delete2(value) {
    var delete_id = value;
    // Make a request for a user with a given ID
    axios
      .delete("/home/menu", {
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
function myFunction_delete3(value) {
  var delete_id3 = value;
  // Make a request for a user with a given ID
  axios
    .delete("/home/menu", {
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
function updateDB(){
  console.log( " updateDB ")
      axios
      .put("/home/menu", {
          id: document.getElementById("myid").value,
          sesa_no: document.getElementById("sesa_no").value,
          first_name: document.getElementById("first_name").value,
          last_name: document.getElementById("last_name").value,
          user_name: document.getElementById("user_name").value,
          mob_no: document.getElementById("mob_no").value,
          password: document.getElementById("password").value        
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

