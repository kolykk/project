var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var date = require('node-datetime');
var util =require('util');
var uuid = require('node-uuid');
var routes = require('./routes/server');
var ejsLint=require('ejs-lint/index.js');
var qs = require('querystring');
var selectcassandra = require('./routes/selectcassandra');
var insertcassandra= require('./routes/insertcassandra');
var selectdetail = require('./routes/selectdetail');
var selecttransaction = require('./routes/selecttransaction');
var cassandra = require('cassandra-driver');
var client = new cassandra.Client({contactPoints: ['127.0.0.1'] }); //connect cassandra
////////////////////////Using Express framework///////////////////////////
var app = express();
const line =  require('node-line-bot-api');
///////////////////END Using Express framework///////////////////////////


//////////////////////////End Route ///////////////////////////////

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use('/',routes);
app.use('/login',routes);

app.use('/test',routes);
app.get('/manageinfo',selectcassandra);
app.use('/manageinfo',routes);
app.use('/register',insertcassandra);
app.get('/transactions',selecttransaction);
app.use('/creNewDetail',routes);
app.get('/managedetail',selectdetail);
app.use('/managedetail',routes);




///////////////////////Line BOT API//////////////////////
/*
line.init({
  accessToken: 'CdDYlY9qqNN7g64umv6/8UFdJE2x44h+8n2IdV74kiEY8OIftb9SMwqjr9O4VzEFu7Xh/V/Fkh5fVpqiGuzntROv/PocnPGQXtrN5i0azudzHYxapZqVnTpfrQZF2IxwqkRvkZFGyQ3GWbBUs0H2BAdB04t89/1O/w1cDnyilFU=',
  // (Optional) for webhook signature validation
  channelSecret: 'd42dbcc257489b8600bd879c33ca3d44'
})
 console.log("Sending messages to Line API");
 line.client.pushMessage({

            to: 'Ubf06abaa5636d4204976ee3939dcab40',
            messages:[
                {
                    "type":"text",
                    "text":"Warning"
                }
            ]
          })

          */

/*
 

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/

module.exports = app;
