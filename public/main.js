// const endTime = new Date('2020-01-26 10:00:00').getTime()+ 24 * 60 * 60 * 1000;

var now = new Date();
var day = ("0" + now.getDate()).slice(-2);
var month = ("0" + (now.getMonth() + 1)).slice(-2);
var today = now.getFullYear() + "-" + month + "-" + day;
// var today = now.getFullYear() + "-" + month + "-" + (day+1);
var myhour=now.getHours();

var t_currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
var t_day = t_currentDate.getDate();
var t_month = ("0"+ (t_currentDate.getMonth() + 1)).slice(-2);
var t_year = t_currentDate.getFullYear();
var tommorow =t_year+"-" + t_month+"-" + t_day + "T10:00:00";
var tommorowTimeStampe=Date.parse(tommorow)/1000;
console.log("tommorow at 10am: "+ tommorow);

var y_currentDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
var y_day = y_currentDate.getDate();
var y_month = ("0"+ (y_currentDate.getMonth() + 1)).slice(-2);
var y_year = y_currentDate.getFullYear();
var yesterday =y_year+"-" + y_month+"-" + y_day + "T00:00:01";
var yestersayTimeStampe = Date.parse(yesterday)/1000;
console.log("yesterdayTimeStampe: "  + yestersayTimeStampe);

var endTime, endTime;
// if (myhour >9 ){
//   // alert(tommorow);
//   endTime = tommorowTimeStampe;
//   //alert (endTime);
//   console.log("endTime >9: " + endTime);
// //const endTime = now.getFullYear() + "-" + month + "-" + now.getDay();
// }

//const endTime = new Date().getTime();
// const spanD = document.querySelector('span.d');
const spanH = document.querySelector('span.h');
const spanM = document.querySelector('span.m');
const spanS = document.querySelector('span.s');

setInterval(() => {
if (myhour<10){
  console.log("today: "+today);
  var todayAt10 =today + "T10:00:00";
  endTime = Date.parse(todayAt10)/1000;
  console.log("today (endtime <10): "+ endTime);
} else{
  endTime = tommorowTimeStampe
  console.log("tommorow (endtime  <10): "+ endTime);
}

nowTime = new Date().getTime();
nowTime=Math.floor(nowTime/1000);
 // const time = Math.floor((endTime - nowTime) / 1000);
 var mytime = endTime - nowTime;
console.log("endTime: "+endTime);
console.log("nowTime: "+nowTime);
//  const days = Math.floor((endTime / (1000 * 60 * 60 * 24)) - (nowTime / (1000 * 60 * 60 * 24)));
 console.log("pozostały czas do zamowienia: " + mytime);

 let hours = Math.floor((endTime / ( 60 * 60) - nowTime / ( 60 * 60)) % 24);
 // Przykład - dodanie 0 przeg godziną 
 hours = hours < 10 ? `0${hours}` : hours;
//  console.log(hours);
 const minutes = Math.floor((endTime / ( 60) - nowTime / ( 60)) % 60);

 const secs = Math.floor((endTime  - nowTime ) % 60);
 
//  spanD.textContent = days;
 spanH.textContent = hours;
 spanM.textContent = minutes;
 spanS.textContent = secs;
}, 1000)
