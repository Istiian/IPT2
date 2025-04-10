var createError = require('http-errors');  // for error handling
var express = require('express'); // for express framework
var path = require('path');// for path manipulation
var cookieParser = require('cookie-parser'); // for cookie parsing
var logger = require('morgan'); // for logging
var mysql = require('mysql2'); // for mysql connection
const bcrypt = require('bcrypt'); // for password hashing
const methodOverride = require("method-override"); // for method override
const session = require("express-session"); // for session management 
const multer  = require('multer'); // for file upload
const helmet = require('helmet');
var app = express();

var AdCreateAccountRouter = require('./routes/AdCreateAccountRoute'); // for admin account creation
var AdLoginRouter = require('./routes/AdLoginRoute'); // for admin login
var AdTrackRouter = require('./routes/AdTrackRoute'); // for admin tracking
var AdManageBookingRouter = require('./routes/AdManageBookingRoute'); // for admin booking management
var AdManageRoomRouter = require('./routes/AdManageRoomRoute'); // for admin schedule creation
var AdminRouter = require('./routes/AdminRoute');// for admin account management
var AdDashboardRouter = require('./routes/AdDashboardRoute'); // for admin dashboard


var UserRouter = require('./routes/UserRoute'); // for user account management
var UsBookRouter = require('./routes/UsBookRoute');//  for user booking management
var ChangePassRouter = require("./routes/ChangePassRoute") ;// for user password change
var UsLoginRouter = require("./routes/UsLoginRoute");// for user login
var UsScheduleRouter= require('./routes/UsScheduleRoute');// for user schedule management
var UsReportSubmissionRouter= require('./routes/UsReportSubmissionRoute');// for user report submission
var UsReportFormRouter= require('./routes/UsReportFormRoute');// for user report form
var UsEditRouter = require('./routes/UsEditRoute');

app.use(session({
  secret: 'secret-key', 
  resave: false,
  saveUninitialized: false
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method')); // makes method patch, delete, put works
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/BookingImages') // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })



app.use('/AdCreateAccountRoute', AdCreateAccountRouter);
app.use('/AdLoginRoute', AdLoginRouter)
app.use('/AdTrackRoute', AdTrackRouter)
app.use('/AdManageBookingRoute', AdManageBookingRouter)
app.use('/AdDashboardRoute', AdDashboardRouter)
app.use('/AdManageRoomRoute', AdManageRoomRouter)

app.use('/UserRoute', UserRouter)
app.use('/AdminRoute', AdminRouter)
app.use('/ChangePassRoute', ChangePassRouter)
app.use('/UsBookRoute', UsBookRouter)
app.use('/UsLoginRoute', UsLoginRouter)
app.use('/UsReportFormRoute', UsReportFormRouter)
app.use('/UsScheduleRoute', UsScheduleRouter)
app.use('/UsReportSubmissionRoute', UsReportSubmissionRouter) 
app.use('/UsEditRoute',UsEditRouter )


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


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
