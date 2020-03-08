window.onload = function() {
        
    window.document.getElementById("fname").textContent = getCookie("name")
    var sendTo
    sendTo = "sesa" + getCookie("sesa")+"@se.com"
    // console.log("sendTo: "+ sendTo);
    document.getElementById("emailClient").value = sendTo;

    document.getElementById("complaint").addEventListener("change", function() {
     if (document.getElementById("complaint").options[complaint.selectedIndex].value != "empty") {
       document.getElementById("emailSupplier").value = document.getElementById("complaint").options[complaint.selectedIndex].value
     } else{
       alert ("Musisz wybrać dostawwcę!" )
       document.getElementById("emailSupplier").value =""
     }
    });
    document.getElementById("btnSend").addEventListener("mouseover", function() {      
      if (document.getElementById("emailClient").value == "" || document.getElementById("emailText").value == "" ){
        alert ("Uzupełnij odbiorcę lub opis reklamacji")
      }
    })

  }; //onload
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