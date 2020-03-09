/**
* Module dependencies.
*/
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var session = require('express-session');
var app = express();
var mysql = require('mysql');
var  cookieparser = require('cookie-parser');
var bodyParser=require("body-parser");
const fetch = require('node-fetch');
const axios = require('axios').default;
const nodemailer = require('nodemailer');
var FormData = require('form-data');
var fs = require('fs');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const _ = require('lodash');
const favicon = require('express-favicon');

// var connection = mysql.createConnection({
//               host     : 'mysql.ct8.pl',
//               user     : 'm12289_elunchjs',
//               password : 'Elunchjs2020!1',
//               database : 'm12289_elunchjs'
//             });

var connection = mysql.createConnection({
              host     : 'pi.cba.pl',
              user     : 'Bazapi2019',
              password : 'Bazapi2019',
              database : 'elunch'
            });
connection.connect();
global.db = connection;

 email =  {
  HR: "joanna.laskowska@se.com",
  Finanse: "pawel.pisarkiewicz@se.com",
  Produkcja : "rafal.zietak@se.com",
  Metody : "agnieszka.nalaznik@se.com",
  SERE: "malgorzata.lekston@se.com",
  Dyrektor: "piotr.wojsa@se.com",
  Projekty : "liliana.grzanka@se.com",
  Jakość: "tomasz.ignasiak@se.com",
  Logistyka : "pawel.malczyk@se.com",
  Inny: "katarzyna.orlowska@se.com"
}
global.email;

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
              secret: 'keyboard cat',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 60000000 }
            }))
app.use(cookieparser());
app.use('/public', express.static('public'));
// enable files upload
app.use(fileUpload({
  createParentPath: true
}));
app.use(cors());
app.use(morgan('dev'));
app.use(favicon(__dirname + '/favicon.ico'));

// development only
app.get('/', routes.index);//call for main index page
app.get('/login', routes.index);//call for login page
app.post('/login', user.login);//call for login post
app.get('/home/dashboard', user.dashboard);//call for dashboard page after login
app.get('/home/logout', user.logout);//call for logout
app.get('/home/new_order2', user.new_order2);//call for new_order page to order lunch
app.post('/home/new_order2', user.new_order2);//call for new_order page to order lunch
app.put('/home/new_order2', user.new_order2);//call for new_order page to order lunch
app.delete('/home/new_order2', user.new_order2);//call for new_order page to order lunch
app.get('/home/orders2', user.orders2); // list of orders2
app.post('/home/orders2', user.orders2); // list of orders2
app.get('/home/new_list', user.list);//call for new_list page to order lunch
app.post('/home/new_list', user.list);//call for new_list page to order lunch
app.get('/home/raport', user.raport);//call for raport page 
app.post('/home/raport', user.raport);//call for raport page 
app.get('/home/admin', user.admin);//call for admin page 
app.post('/home/admin', user.admin);//call for admin page 
app.put('/home/admin', user.admin);//call for admin page 
app.delete('/home/admin', user.admin);//call for admin page 
app.get('/home/users', user.users);//call for admin page 
app.post('/home/users', user.users);//call for admin page 
app.put('/home/users', user.users);//call for admin page 
app.delete('/home/users', user.users);//call for admin page 
app.get('/home/menu', user.menu);//call for admin page 
app.post('/home/menu', user.menu);//call for admin page 
app.put('/home/menu', user.menu);//call for admin page 
app.delete('/home/menu', user.menu);//call for admin page 
app.get('/home/additional', user.additional);//call for admin page 
app.post('/home/additional', user.additional);//call for admin page 
app.put('/home/additional', user.additional);//call for admin page 
app.delete('/home/additional', user.additional);//call for admin page 
app.get('/home/guest', user.guest);//call for guest page 
app.post('/home/guest', user.guest);//call for guest page 
app.put('/home/guest', user.guest);//call for guest page 
app.delete('/home/guest', user.guest);//call for guest page 
app.get('/home/complaint', user.complaint);//call for complaint page 
app.post('/home/complaint', user.complaint);//call for complaint page
app.get('/home/complaint', user.complaint);//call for complaint page
app.post('/home/upload', user.upload);//call for complaint page 

//Middleware
app.listen(8080);