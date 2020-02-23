window.onload = function() {
  var $table = $("#table"); 
  // Make a request for a user with a given ID
    axios
     .post("/home/users", {
        mypost: "mypost"       
      })
      .then(function(response) {
        // handle success
        var users = response.data.message2;
        console.log ("users: " + users);
        var users2 = JSON.stringify(users);
        console.log("users2: " + users2 );
        $table.bootstrapTable('destroy');
        $table.bootstrapTable({ data: users ,
          columns: [,,,,,,,
          {
            field: 'delete1',
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
    "click .update": function(e, value, row, index) {
        document.getElementById("myid2").value=row.id;
        document.getElementById("sesa_no2").value=row.sesa_no;
        document.getElementById("first_name2").value=row.first_name
        document.getElementById("last_name2").value=row.last_name
        document.getElementById("user_name2").value=row.user_name
        document.getElementById("mob_no2").value=row.mob_no
        document.getElementById("password2").value = row.password
        document.getElementById("btn_update").style.display = "inline"
        document.getElementById("btn_add").style.display = "none"
      //updateRow2(row.id); 
    }
  }                 
} //end of onload
function passwordFormatter(value) {
  return '<input disabled type="password" style="width:auto; font-size:18px; border:none; background-color:white;" value="'+value.substring(1)+'"></input>'
}
function addUser1(){
    axios
    .post("/home/users", {
      addUsers:"addUsers",
      sesa_no: document.getElementById("sesa_no2").value,
      first_name: document.getElementById("first_name2").value,
      last_name: document.getElementById("last_name2").value,
      mob_no: document.getElementById("mob_no2").value,
      user_name: document.getElementById("user_name2").value,
      password: document.getElementById("password2").value 
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
    '<a class="update" href="javascript:void(0)" title="Uaktualnij">',
    '<i class="fa fa-refresh fa-spin"></i>',
    "</a>"
  ].join("");
}  
function myFunction_delete3(value) {
  var delete_id3 = value;
  // Make a request for a user with a given ID
  axios
    .delete("/home/users", {
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
      .put("/home/users", {
          updateUsers: "updateUsers",
          id: document.getElementById("myid2").value,
          sesa_no: document.getElementById("sesa_no2").value,
          first_name: document.getElementById("first_name2").value,
          last_name: document.getElementById("last_name2").value,
          user_name: document.getElementById("user_name2").value,
          mob_no: document.getElementById("mob_no2").value,
          password: document.getElementById("password2").value  
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

