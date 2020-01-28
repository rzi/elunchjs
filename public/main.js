// Client side js

const spanH = document.querySelector("span.h");
const spanM = document.querySelector("span.m");
const spanS = document.querySelector("span.s");
const spanF = document.querySelector("span.f");

var endTime, endTime, now, today, tommorow, day, month ;

now = new Date();
day = ("0" + now.getDate()).slice(-2);
month = ("0" + (now.getMonth() + 1)).slice(-2);
today = now.getFullYear() + "-" + month + "-" + day;
console.log("today" + today);
document.getElementById("lunch_order").value=today;

var my_supplier = document.getElementById("activeSupplier").innerText;
if ( my_supplier == ""){
  my_supplier="Mucha";  
  document.getElementById("activeSupplier").innerText=my_supplier;
}

var my_date=document.getElementById("lunch_order").value

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  //console.log(e.target.innerHTML); // newly activated tab
  document.getElementById("activeSupplier").innerText=e.target.innerHTML;
  var my_date1= document.getElementById("lunch_order").value
  my_supplier=e.target.innerHTML;
  setCookie("my_supplier", my_supplier);
  setCookie("my_date1", my_date1); 
  sendSupplier(e.target.innerHTML,my_date1);
});

document.getElementById("lunch_order").addEventListener("change", function(){
  // var justNow = new Date();
  // var justNowTimestamp = Math.floor(justNow/1000);
  // console.log( "just now " + justNowTimestamp); 
  //alert(justNow.toLocaleString()); 
  
  // var todayAt10 = Date.parse(today + "T10:00:00")/1000;
  // console.log("todayAt10: " + todayAt10);
  // var todayAt00 = Date.parse(today + "T00:00:01")/1000;
  // console.log("todayAt00: " + todayAt00);

  // var t_currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); //tommorow
  // var t_day = t_currentDate.getDate();
  // var t_month = ("0"+ (t_currentDate.getMonth() + 1)).slice(-2);
  // var t_year = t_currentDate.getFullYear();
  // tommorow = t_year+"-" + t_month+"-" + t_day + "T00:00:00";
  // var tommorow_timestamp = Date.parse(tommorow)/1000;
  // console.log("tommorowAt00: " + tommorow_timestamp);
       
  // var datePickerValue=document.getElementById("lunch_order").value;
  // var mydatePicker = datePickerValue + "T"+justNow.toLocaleTimeString();
  // alert(mydatePicker);
  // var mydatePickerTimeStamp =Date.parse(mydatePicker)/1000;
  // console.log("datapicker: " + mydatePicker);
      
  // if (mydatePickerTimeStamp >todayAt00 && mydatePickerTimeStamp < todayAt10 || mydatePickerTimeStamp > tommorow_timestamp){
  //   alert( " mozna zamawiać bo nie ma jeszcze 10:00 lub zamówieine jest na następne dni");
  //   document.getElementById("f").innerText="1";
  //   sendDate(document.getElementById("lunch_order").value);
  // } else{
  //   document.getElementById("f").innerText="0";
  // };
  sendDate(document.getElementById("lunch_order").value);
});

var myhour = now.getHours();

// var t_currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
// var t_day = t_currentDate.getDate();
// var t_month = ("0" + (t_currentDate.getMonth() + 1)).slice(-2);
// var t_year = t_currentDate.getFullYear();
// var tommorow = t_year + "-" + t_month + "-" + t_day + "T10:00:00";
// var tommorowTimeStampe = Date.parse(tommorow) / 1000;
// console.log("tommorow at 10am: " + tommorow);

var y_currentDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
var y_day = y_currentDate.getDate();
var y_month = ("0" + (y_currentDate.getMonth() + 1)).slice(-2);
var y_year = y_currentDate.getFullYear();
yesterday = y_year + "-" + y_month + "-" + y_day + "T00:00:01";
var yesterdayTimeStampe = Date.parse(yesterday) / 1000;
console.log("yesterdayTimeStampe: " + yesterdayTimeStampe);

setInterval(() => {
  console.log("Start");
  // take current value of datapicker  YYYY-MM-DD, 00:00:00
  var datePickerValue=document.getElementById("lunch_order").value;
  var parts = datePickerValue.split('-');
  parts[3]=0;
  parts[4]=0;
  parts[5]=0;
  var mydate1 = new Date(parts[0], parts[1] - 1, parts[2],parts[3],parts[4],parts[5]);
  var pickerAt00TimeStamp = Date.parse(mydate1) / 1000; 
  console.log("pickerAt00TimeStamp " + " " + mydate1.toLocaleString());

  nowTime1 = new Date()//.getTime();
  console.log ("nowTime " +  nowTime1.toLocaleString())
  nowTime = Math.floor(nowTime1 / 1000);
  console.log ("nowTimeTimeStamp " +  nowTime);

  var todayAt00 = Date.parse(today + "T00:00:00")/1000;
  console.log("todayAt00: " + todayAt00);
  
  var todayAt10 = today + "T10:00:00";
  console.log("todayAt10: " + todayAt10);
  var todayAt10TimeStamp = Date.parse(todayAt10)/1000;
  console.log("todayAt10TimeStamp: " + todayAt10TimeStamp);

  var t_currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); //tommorow
  var t_day = t_currentDate.getDate();
  var t_month = ("0"+ (t_currentDate.getMonth() + 1)).slice(-2);
  var t_year = t_currentDate.getFullYear();
  tommorow = t_year+"-" + t_month+"-" + t_day + "T00:00:00";
  var tommorowAt00TimeStamp = Date.parse(tommorow)/1000;
  console.log("tommorowAt00TimeStamp: " + tommorowAt00TimeStamp);

  // var mydatePicker = datePickerValue + "T"+justNow.toLocaleTimeString();
  // alert(mydatePicker);
  // var mydatePickerTimeStamp =Date.parse(mydatePicker)/1000;
  // console.log("datapicker: " + mydatePicker);
  console.log(" warunek:");
  console.log("nowTime "+ nowTime1.toLocaleString());
  console.log("pickerAt00TimeStamp "+ mydate1.toDateString());
  console.log("nowTime "+ nowTime1);
  console.log("todayAt10TimeStamp "+ todayAt10);
  console.log("nowTime "+ nowTime1);
  console.log("tommorowAt00TimeStamp "+ tommorow);

  // check day: datapicker = mydate1Timestamp -> YYYY-MM-DD, 00:00:00
  if (pickerAt00TimeStamp >= todayAt00 && nowTime >= pickerAt00TimeStamp  && nowTime < todayAt10TimeStamp || pickerAt00TimeStamp >= tommorowAt00TimeStamp  ){
     console.log( " zamawiam" );
     document.getElementById("f").innerText="1";
     document.getElementById("mesg").innerText=" ";
  }else {
    console.log ( " nic z tego " );
    document.getElementById("f").innerText="0";
    document.getElementById("mesg").innerText=" *nie mozna zamówić na wybrany dzień";
  }

  if ( nowTime >=todayAt00 && nowTime<= todayAt10TimeStamp){
    // document.getElementById("myClock").innerText=" aaaaaaaa";
  } else{
    document.getElementById("myClock").innerText="";
  }


  if (myhour < 10) {
    // console.log("today: " + today);
    var todayAt10 = today + "T10:00:00";
    endTime = Date.parse(todayAt10) / 1000;
    // console.log("today (endtime <10): " + endTime + " " + today);
  } else {
    endTime = tommorowAt00TimeStamp;
    // console.log("tommorow (endtime  >10): " + endTime + " " + tommorow);
  }


  
  var mytime = endTime - nowTime;
  // console.log("endTime: " + endTime + " " + Date(endTime).toString());
  // console.log("nowTime: " + nowTime + " " + Date(nowTime).toString());
  console.log("pozostały czas do zamowienia: " + mytime);

  let hours = Math.floor((endTime / (60 * 60) - nowTime / (60 * 60)) % 24);
  // Przykład - dodanie 0 przeg godziną
  hours = hours < 10 ? `0${hours}` : hours;

  let minutes = Math.floor((endTime / 60 - nowTime / 60) % 60);
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  
  const secs = Math.floor((endTime - nowTime) % 60);

  if (mytime > 0){
    // document.getElementById("f").innerText="1";
  } else{
    // document.getElementById("f").innerText="0";
    location.reload();
  }

  hours  > 0 ? spanH.textContent = hours : spanH.textContent = 0;
  minutes > 0 ? spanM.textContent = minutes : spanM.textContent = 0;
  secs >0 ? spanS.textContent = secs : spanS.textContent = 0;
  }, 1000);

// Funkcje
function sendSupplier(supplier,mydate1){
  // Make a request for a user with a given ID
  axios.get('/home/new_order?supplier='+supplier+'&mydate='+mydate1)
    .then(function (response) {
    // handle success
    // console.log(response.data);
    // location.reload();
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
};
function sendDate(mydate){
  // Make a request for a user with a given ID
  axios.get('/home/new_order?mydate='+mydate)
    .then(function (response) {
    // handle success
    // console.log(response.data);
    location.reload();
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
};
function myFunction_order (value){
  // Make a request for a user with a given ID
      axios.post('/home/new_order', {     
          sesa_no1: document.getElementById("sesa_no1").innerText,
          supplier: document.getElementById("activeSupplier").innerText,
          order_date: document.getElementById("lunch_order").value,
          order_no: value           
      })
      .then(function (response) {
        // handle success
        location.reload();
        //console.log(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .finally(function () {
          // always executed
        });
};
function myFunction_delete (value){
   var delete_id = value;
  // Make a request for a user with a given ID
    axios.delete('/home/new_order', {
       data:{ 
      delete_id: delete_id  }                      
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
};
function myFunction_calendar2(){
  alert("AAAAAAAAA");
};
function myFunction_calendar(today) {
  alert ("calendar change: "+ document.getElementById("lunch_order").value);
  var todayAt10 = Date.parse(today + "T10:00:00")/1000;
  console.log("todayAt10: " + todayAt10);

  var  todayAt00 = Date.parse(today + "T00:00:01")/1000;
  console.log("todayAt00: " + todayAt00);

  var t_currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  var t_day = t_currentDate.getDate();
  var t_month = ("0"+ (t_currentDate.getMonth() + 1)).slice(-2);
  var t_year = t_currentDate.getFullYear();
  var tommorow =t_year+"-" + t_month+"-" + t_day + "T00:00:01";
  var tommorow_timestamp = Date.parse(tommorow)/1000;
  console.log("tommorowAt00: " + tommorow_timestamp);

  var d = new Date();
  var justNow= d.valueOf();
  var justNowTimestamp = Math.floor(justNow/1000);
  console.log( "just now " + justNowTimestamp);  
  var datePickerValue=document.getElementById("lunch_order").value;
  var mydatePicker = datePickerValue + "T00:00:01";
  console.log("datapicker: " + mydatePicker);

  if (justNowTimestamp< todayAt10 && justNowTimestamp<todayAt00){
    aletr( " mozna zamawiać");
    sendDate(document.getElementById("lunch_order").value);
  };

};
function setCookie(name, val, days, path, domain, secure) {
  if (navigator.cookiesEnabled) {
      const cookieName = encodeURIComponent(name);
      const cookieVal = encodeURIComponent(val);
      let cookieText = cookieName + "=" + cookieVal;

      if (typeof days === "number") {
          const data = new Date();
          data.setTime(data.getTime() + (days * 24*60*60*1000));
          cookieText += "; expires=" + data.toGMTString();
      }
      if (path) {
          cookieText += "; path=" + path;
      }
      if (domain) {
          cookieText += "; domain=" + domain;
      }
      if (secure) {
          cookieText += "; secure";
      }

      document.cookie = cookieText;
  }
};
function deleteCookie(name) {
    const cookieName = encodeURIComponent(name);
    document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};
function showCookie(name) {
    if (document.cookie != "") {
        const cookies = document.cookie.split(/; */);

        for (let i=0; i<cookies.length; i++) {
            const cookieName = cookies[i].split("=")[0];
            const cookieVal = cookies[i].split("=")[1];
            if (cookieName === decodeURIComponent(name)) {
                return decodeURIComponent(cookieVal);
            }
        }
    }
};
// Koniec funkcji
