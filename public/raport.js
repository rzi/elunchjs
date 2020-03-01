window.onload = function () {
    var dayBefore;
    var $table = $("#table");

    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + month + "-" + day;
    var monthsPL = ["Styczeń","Luty", "Marzec", "Kwiecień","Maj", "Czerwiec","Lipiec","Sierpień","Wrzesień", "Październik", "Listopad","Grudzień"]
    
    if ((day-28) <= 0){
          dayBefore = 25;
          month = month - 1;
          if (month < 1){
              month = 12;
          }
      if (month < 10) {
        month = "0" + month;
      }
    } else {	  
      dayBefore =day-5
    }	  

    if (dayBefore<10){
      dayBefore = "0" + dayBefore
    }
    var before_few_days = now.getFullYear() + "-" + month + "-" + dayBefore;
    console.log(today); 
    document.getElementById("data_to").value = today;
    document.getElementById("data_from").value = before_few_days;

    document.getElementById("selectType").addEventListener("click", function () {
      var mytype = document.getElementById("selectType");
      var typeValue = mytype.options[mytype.selectedIndex].value;
      if (typeValue == "dvc") {
        document.getElementById("workers").innerHTML = "PŁATNI DO 10. DNIA"
      } else if (typeValue == "mbc") {
        document.getElementById("workers").innerHTML = "PŁATNI DO OSTATNIEGO DNIA"  
      }

    })

    document.getElementById("btn").addEventListener("click", function () {
       // console.log(" click btn1: ");
       var mytype = document.getElementById("selectType");
       var typeValue = mytype.options[mytype.selectedIndex].value;
       console.log("TypeValue " + typeValue )

       var raport = document.getElementById("selectRaport");
       var raportValue = raport.options[raport.selectedIndex].value;
       console.log("raportValue " + raportValue )
      if (typeValue == "empty" || raportValue == "empty" ){
        alert (" Wybierz typ raportu oraz grupę")
        return
      }
      var myMonth = monthsPL[now.getMonth()] + " " + now.getFullYear()
      // alert (myMonth)
      document.getElementById("month").innerHTML = myMonth 

      document.getElementById("table-responsive").style.display = "flex";
       // Make a request for a user with a given ID
       axios.post('/home/raport', {
          data_from: document.getElementById("data_from").value,
          data_to: document.getElementById("data_to").value,
          typeValue: typeValue,
          raportValue: raportValue
      })
      .then(function (response) {
        // handle success
       var table_data = response.data.message;
       var table_data2 = JSON.stringify(table_data );
          console.log("table_data: " + table_data2 );
          $table.bootstrapTable('destroy');
          $table.bootstrapTable({ data: table_data});
          //hide not active column
          if  (raportValue == "founding" ){
            $table.bootstrapTable('hideColumn', 'SUM(`deduction`)')  
          } else {
            $table.bootstrapTable('hideColumn', 'SUM(`founding`)')  
          }   
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });        
    });

   } //end of window load

   function operateFormatter5(value, row, index) {
    var raport = document.getElementById("selectRaport");
    var raportValue = raport.options[raport.selectedIndex].value;
    if (raportValue == "founding"){
      return [                
        value = "FINANSOWANE PRZEZ PRACODAWCĘ ŚWIADCZENIE RZECZOWE TYLKO OPODATKOWANE; ZE ŚRODKÓW OBROTOWYCH"
      ].join('')
    } else {
      return [                
        value ="POTRĄCENIE OD NETTO"
      ].join('')
    }
   }      
    function operateFormatter7(value, row, index) {
      var raport = document.getElementById("selectRaport");
      var raportValue = raport.options[raport.selectedIndex].value;
      if (raportValue == "founding"){
        return [                
          value = "3985"
        ].join('')
      } else {
        return [                
          value ="6884"
        ].join('')
      }      
  }
  function operateFormatter6(value, row, index) {
    var raport = document.getElementById("selectRaport");
    var raportValue = raport.options[raport.selectedIndex].value;
    if (raportValue == "founding"){
      return [                
        value = "DOFINANSOWANIE DO POSIŁKÓW"
      ].join('')
    } else {
      return [                
        value ="POTRĄCENIE ZA POSIŁKI"
      ].join('')
    }
  }  
  function priceFormatter2(data) {
    var field = this.field
    return  data.map(function (row) {
      return row[field]
    }).reduce(function (sum, i) {
      return sum + i
    }, 0)
  }

  function priceFormatter1(data) {
    var field = this.field
    return  data.map(function (row) {
      return row[field]
    }).reduce(function (sum, i) {
      return sum + i
    }, 0)
  }