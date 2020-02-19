window.onload = function() {
    var $table = $("#table");
    // Make a request for a user with a given ID
        axios
          .get("/home/admin", {
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

                console.log( " update " + row.id)
                axios
                .put("/home/admin", {
                    id: row.id,
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
        }

               
} //end of onload

function addUser1(){
    axios
    .post("/home/admin", {
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
function myFunction_delete2(value) {
    var delete_id = value;
    // Make a request for a user with a given ID
    axios
      .delete("/home/admin", {
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
