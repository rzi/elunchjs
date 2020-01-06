function addRow() {
          
    var myName = document.getElementById("name");
    var age = document.getElementById("age");
    var table = document.getElementById("myTableData");
 
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
 
    row.insertCell(0).innerHTML= '<input type="button" value = "Delete" onClick="Javacsript:deleteRow(this)">';
    row.insertCell(1).innerHTML= myName.value;
    row.insertCell(2).innerHTML= age.value;
 
}
 
function deleteRow(obj) {
      
    var index = obj.parentNode.parentNode.rowIndex;
    var table = document.getElementById("myTableData");
    table.deleteRow(index);
    
}
 
function addTable() {
      
    var myTableDiv = document.getElementById("myDynamicTable");
      
    var table = document.createElement('TABLE');
    table.border='1';
    
    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);
      
    for (var i=0; i<3; i++){
       var tr = document.createElement('TR');
       tableBody.appendChild(tr);
       
       for (var j=0; j<4; j++){
           var td = document.createElement('TD');
           td.width='75';
           td.appendChild(document.createTextNode("Cell " + i + "," + j));
           tr.appendChild(td);
       }
    }
    myTableDiv.appendChild(table);
    
}
 
function load() {
    
    console.log("Page load finished");
    generateDynamicTable();
 
}

var myContacts = [
    {
        id: 1,
        Id_sesa_no: 1,
        order_date: '2020-01-08',
        order_supplier_name: 'Opoka',
        order_no: 1,
        order_name: 'Kotlet',
        order_price: 7
      }
  ];

function generateDynamicTable(){
  
      var noOfContacts = myContacts.length;
      
      if(noOfContacts>0){
          

          // CREATE DYNAMIC TABLE.
          var table = document.createElement("table");
          table.style.width = '50%';
          table.setAttribute('border', '1');
          table.setAttribute('cellspacing', '0');
          table.setAttribute('cellpadding', '5');
          
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
                      td.innerHTML = myContacts[i][col[j]];
                      bRow.appendChild(td);
                  }
                  tBody.appendChild(bRow)

          }
          table.appendChild(tBody);	
          
          
          // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
          var divContainer = document.getElementById("myContacts");
          divContainer.innerHTML = "";
          divContainer.appendChild(table);
          
      }	
  }
