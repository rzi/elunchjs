const endTime = new Date('2020-01-26 10:00:00').getTime()+ 24 * 60 * 60 * 1000;

// const spanD = document.querySelector('span.d');
const spanH = document.querySelector('span.h');
const spanM = document.querySelector('span.m');
const spanS = document.querySelector('span.s');

setInterval(() => {
 const nowTime = new Date().getTime();
 // const time = Math.floor((endTime - nowTime) / 1000);
 const time = endTime - nowTime;
 const days = Math.floor((endTime / (1000 * 60 * 60 * 24)) - (nowTime / (1000 * 60 * 60 * 24)));
 console.log(days);

 let hours = Math.floor((endTime / (1000 * 60 * 60) - nowTime / (1000 * 60 * 60)) % 24);
 // Przykład - dodanie 0 przeg godziną 
 hours = hours < 10 ? `0${hours}` : hours;

 const minutes = Math.floor((endTime / (1000 * 60) - nowTime / (1000 * 60)) % 60);

 const secs = Math.floor((endTime / 1000 - nowTime / 1000) % 60);

//  spanD.textContent = days;
 spanH.textContent = hours;
 spanM.textContent = minutes;
 spanS.textContent = secs;
}, 1000)
