window.onload = function() {
  var dayBefore;
  var $table = $("#table");

  var now = new Date();
  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear() + "-" + month + "-" + day;

  if (day - 5 <= 0) {
    dayBefore = 25;
    month = month - 1;
    if (month < 1) {
      month = 12;
    }
    if (month < 10) {
      month = "0" + month;
    }
  } else {
    dayBefore = day - 5;
  }

  if (dayBefore < 10) {
    dayBefore = "0" + dayBefore;
  }
  var before_few_days = now.getFullYear() + "-" + month + "-" + dayBefore;
  document.getElementById("data_to").value = today;
  document.getElementById("data_from").value = before_few_days;
  document.getElementById("btn").addEventListener("click", function() {
    document.getElementById("table-responsive").style.display = "table";

    // Make a request for a user with a given ID
    axios
      .post("/home/orders2", {
        data_from: document.getElementById("data_from").value,
        data_to: document.getElementById("data_to").value
      })
      .then(function(response) {
        // handle success
        var table_data = response.data.message;

        // console.log("table_data: " + table_data2);

        $table.bootstrapTable("destroy");

        $table.bootstrapTable({ data: table_data });

      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .finally(function() {
        // always executed
      });
  });

  // Make a request for a user with a given ID
  axios
    .post("/home/orders2", {
      data_from: document.getElementById("data_from").value,
      data_to: document.getElementById("data_to").value
    })
    .then(function(response) {
      // handle success
      var table_data = response.data.message;
      var table_data2 = JSON.stringify(table_data);
      //console.log("table_data: " + table_data2);
      $table.bootstrapTable("destroy");
      $table.bootstrapTable({ data: table_data });
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    })
    .finally(function() {
      // always executed
    });
}; //end of window load
