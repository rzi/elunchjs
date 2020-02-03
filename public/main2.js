
var myContacts = [
  {
    id: 1,
    Id_sesa_no: 1,
    order_date: '2020-01-08',
    order_supplier_name: 'Opoka',
    order_no: 1,
    order_name: 'Kotlet',
    order_price: 7
  },
  {
    id: 2,
    Id_sesa_no: 2,
    order_date: '2020-01-08',
    order_supplier_name: 'Opoka',
    order_no: 2,
    order_name: 'Kotlet',
    order_price: 7
  }
];

// Get today date in the format YYYY-MM-DD

  axios.get('/home/new_order2')
    .then(function (response) {
    // handle success
    // console.log(response.data);
    // location.reload();
    myContacts=JSON.stringify(response.data);
     console.log(myContacts);
    //myContacts=JSON.parse(myContacts);
    generateDynamicTable();
    //location.reload();
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });



function generateDynamicTable() {
  var noOfContacts = myContacts.length;
  if (noOfContacts > 0) {
    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");
    table.style.width = '100%';
    table.setAttribute('border', '3');
    table.setAttribute('cellspacing', '10');
    table.setAttribute('cellpadding', '5');
    table.setAttribute('padding', '5');

    // retrieve column header ('Name', 'Email', and 'Mobile')
    var col = []; // define an empty array
    for (var i = 0; i < noOfContacts; i++) {
      for (var key in myContacts[i]) {
        if (col.indexOf(key) === -1) {
          col.push(key);
        }
      }
    }
    // CREATE TABLE HEAD .
    var tHead = document.createElement("thead");
    // CREATE ROW FOR TABLE HEAD .
    var hRow = document.createElement("tr");
    // ADD COLUMN HEADER TO ROW OF TABLE HEAD.
    for (var i = 0; i < col.length; i++) {
      var th = document.createElement("th");
      th.innerHTML = col[i];
      th.style.textAlign="center";
      th.style.padding ="10px";
      hRow.appendChild(th);
    }
    tHead.appendChild(hRow);
    table.appendChild(tHead);
    // CREATE TABLE BODY .
    var tBody = document.createElement("tbody");
    // ADD COLUMN HEADER TO ROW OF TABLE HEAD.
    for (var i = 0; i < noOfContacts; i++) {
      var bRow = document.createElement("tr"); // CREATE ROW FOR EACH RECORD .
      for (var j = 0; j < col.length; j++) {
        var td = document.createElement("td");
        td.style.textAlign="center";
        td.style.padding ="10px";
        td.innerHTML = myContacts[i][col[j]];
        bRow.appendChild(td);
      }
      tBody.appendChild(bRow)
    }
    table.appendChild(tBody);
    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("tablejs");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
  }
}
// Koniec funkcji
