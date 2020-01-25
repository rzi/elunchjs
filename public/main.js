// const endTime = new Date('2020-01-26 10:00:00').getTime()+ 24 * 60 * 60 * 1000;

var now = new Date();
var day = ("0" + now.getDate()).slice(-2);
var month = ("0" + (now.getMonth() + 1)).slice(-2);
var today = now.getFullYear() + "-" + month + "-" + day;
var today = now.getFullYear() + "-" + month + "-" + (day+1);
var myhour=now.getHours();

var t_currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
var t_day = t_currentDate.getDate();
var t_month = ("0"+ (t_currentDate.getMonth() + 1)).slice(-2);
var t_year = t_currentDate.getFullYear();
var tommorow =t_year+"-" + t_month+"-" + t_day + "T10:00:00";
console.log(Date.parse(tommorow));

var y_currentDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
var y_day = y_currentDate.getDate();
var y_month = ("0"+ (y_currentDate.getMonth() + 1)).slice(-2);
var y_year = y_currentDate.getFullYear();
var yesterday =y_year+"-" + y_month+"-" + y_day + "T00:00:01";
console.log("yesterday "  + Date.parse(yesterday));

var endTime;
if (myhour >9 ){
  // alert(tommorow);
  endTime = Date.parse(tommorow);
  console.log(tommorow);
//const endTime = now.getFullYear() + "-" + month + "-" + now.getDay();
}
//const endTime = new Date().getTime();
// const spanD = document.querySelector('span.d');
const spanH = document.querySelector('span.h');
const spanM = document.querySelector('span.m');
const spanS = document.querySelector('span.s');

setInterval(() => {
 const nowTime = new Date().getTime();
 // const time = Math.floor((endTime - nowTime) / 1000);
 const time = endTime - nowTime;
 const days = Math.floor((endTime / (1000 * 60 * 60 * 24)) - (nowTime / (1000 * 60 * 60 * 24)));
//  console.log(days);

 let hours = Math.floor((endTime / (1000 * 60 * 60) - nowTime / (1000 * 60 * 60)) % 24);
 // Przykład - dodanie 0 przeg godziną 
 hours = hours < 10 ? `0${hours}` : hours;
//  console.log(hours);
 const minutes = Math.floor((endTime / (1000 * 60) - nowTime / (1000 * 60)) % 60);

 const secs = Math.floor((endTime / 1000 - nowTime / 1000) % 60);
 
//  spanD.textContent = days;
 spanH.textContent = hours;
 spanM.textContent = minutes;
 spanS.textContent = secs;
}, 1000)
