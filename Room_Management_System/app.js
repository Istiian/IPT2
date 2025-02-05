var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2');
const bcrypt = require('bcrypt');
const methodOverride = require("method-override");
var app = express();

var SignUpRouter = require('./routes/SignUpRoute');
var LoginRouter = require('./routes/LoginRoute');
var UserRouter = require('./routes/UserRoute');
var AdminRouter = require('./routes/AdminRoute');
var ChangePassRouter = require("./routes/ChangePassRoute")


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method')); // makes method patch, delete, put works
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/SignUpRoute', SignUpRouter);
app.use('/LoginRoute', LoginRouter)
app.use('/UserRoute', UserRouter)
app.use('/AdminRoute', AdminRouter)
app.use('/ChangePassRoute', ChangePassRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// MYSQL Connection


// connection.query("SELECT * FROM room", (err,results,fields)=>{
//   if (err) {
//     console.error(err.message);
//     return;
//   }
//   console.log('Query Results:', results);
// });


// error handle
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
