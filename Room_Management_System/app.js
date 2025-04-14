var createError = require('http-errors');  // for error handling
var express = require('express'); // for express framework
var path = require('path');// for path manipulation
var cookieParser = require('cookie-parser'); // for cookie parsing
var logger = require('morgan'); // for logging
var winston = require('winston')
// for mysql connection
const bcrypt = require('bcrypt'); // for password hashing
const methodOverride = require("method-override"); // for method override
const session = require("express-session"); // for session management 
const multer = require('multer'); // for file upload
var app = express();
const server = require("http").createServer(app)
const io = require("socket.io")(server, { cors: { origin: "*" } });
const { marked } = require("marked");
const moment = require("moment")
require('dotenv').config();

server.listen(3001, () => {
  console.log("Listening")
});


var mysql = require('mysql2/promise');

async function GetRoomData() { // Properly define your function
  let connection;
  try {
    // Initialize the connection asynchronously
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '12345',
      database: 'room_management'
    });

    console.log('Database connection established.');

    // Query the database
    const SqlStatement = `SELECT Room_Name AS Roomname, Features FROM room`;
    const [data] = await connection.query(SqlStatement); // Fetch data
    return data;

  } catch (err) {
    console.error('Connection Error:', err.message);
  } finally {
    // Ensure connection is closed to avoid resource leaks
    if (connection) {
      await connection.end();
      console.log('Connection closed.');
    }
  }
}

async function GetBookingData() {

  let connection;
  try {
    // Initialize the connection asynchronously
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '12345',
      database: 'room_management'
    });

    console.log('Database connection established.');

    // Query the database
    const SqlStatement = `SELECT RoomName,Username AS ReservedBy,BookingDate,StartTime,EndTime FROM booking 
        WHERE (BookingDate > CURDATE() OR (BookingDate = CURDATE() AND ENDTIME >= CURTIME()))
        ORDER BY BookingDate ASC, StartTime ASC;`;
    const [data] = await connection.query(SqlStatement); // Fetch data

    const RoomData = data.map((d) => ({
      RoomName: d.RoomName, // Use the correct key name (RoomName instead of Roomname)
      ReservedBy: d.ReservedBy,
      BookingDate: moment.utc(d.BookingDate).local().format('YYYY-MM-DD '), // Convert to local timezone
      StartTime: d.StartTime, // Keep as StartTime
      EndTime: d.EndTime, // Fix duplicate issue with EndTime
    }));

    return RoomData;

  } catch (err) {
    console.error('Connection Error:', err.message);
  } finally {
    // Ensure connection is closed to avoid resource leaks
    if (connection) {
      await connection.end();
      console.log('Connection closed.');
    }
  }
}


io.on("connection", (socket) => {
  console.log("User Connected: ", socket.id);

  socket.on("SendMessage", async (data) => {
    try {
      let RoomData = JSON.stringify(await GetRoomData())
      let BookingData = JSON.stringify(await GetBookingData());

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.AI}`, // Ensure the AI key is loaded
          "HTTP-Referer": "https://www.chatbot.com",
          "X-Title": "CCDO-CHATBOT",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat", // The AI model specified by the client
          messages: [
            {
              role: "system",
              content: `
                You are a helpful room reservation system assistant. Here's some background info you must use when answering:
                - Only answer those questions related room reservation system and unrelated answer should be refrain.
                - The Date span of book reservation is 1 week, and you cannot reserve 1 week advance.
                - The report submission after using room is required.
                - The reserved room can be cancel and edit.
                - The process of overall room reservation is choosing the desired and unoccupied room in specific date and time and submitting after using the reserved room.
                - Only rooms from Innovation building in City of Malabon University is included.
                - Do not share the Username of the user who make the room reservation.
                - User can change password and access it is information in profile where it is located in user dropdown
                - When user received invalid time it indicates the date and time is passed.
                - When selected time is already occupied it indicates their chosen time is already occupied.
                - You cannot directly make a reservation, edit, cancel or submit reports you are only able to answer users' question
                

                Here is the navigation of the system:
                - Appointment, where the user can make a reservation
                - Schedule, where the user can see it's reservation and able to edit and cancel it
                - Reports, where user can see the user's due report submission after using rooms

                Here is the information on the rooms:
                ${RoomData}

                Here is the reserved rooms or occupied room in specific date and time of room: 
                ${BookingData}
              `
            },
            {
              role: "user",
              content: data
            }
          ] // Wrap the message in an array
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      let aiResponse = result.choices?.[0]?.message?.content;

      if (typeof aiResponse !== "string") {
        console.error("AI response is not a string:", aiResponse);
        aiResponse = "Sorry, I couldn't generate a valid response.";
      }

      const formattedResponse = marked.parse(aiResponse); // Now safely parses
      socket.emit("ReceiveMessage", formattedResponse);

    } catch (error) {
      console.error("Error in fetch request:", error.message);
      socket.emit("ReceiveMessage", "An error occurred while processing your request.");
    }
  });
});

var AdCreateAccountRouter = require('./routes/AdCreateAccountRoute'); // for admin account creation
var AdLoginRouter = require('./routes/AdLoginRoute'); // for admin login
var AdTrackRouter = require('./routes/AdTrackRoute'); // for admin tracking
var AdManageBookingRouter = require('./routes/AdManageBookingRoute'); // for admin booking management
var AdManageRoomRouter = require('./routes/AdManageRoomRoute'); // for admin schedule creation
var AdminRouter = require('./routes/AdminRoute');// for admin account management
var AdDashboardRouter = require('./routes/AdDashboardRoute'); // for admin dashboard


var UserRouter = require('./routes/UserRoute'); // for user account management
var UsBookRouter = require('./routes/UsBookRoute');//  for user booking management
var UsProfileRouter = require("./routes/UsProfileRoute");// for user password change
var UsLoginRouter = require("./routes/UsLoginRoute");// for user login
var UsScheduleRouter = require('./routes/UsScheduleRoute');// for user schedule management
var UsReportSubmissionRouter = require('./routes/UsReportSubmissionRoute');// for user report submission
var UsReportFormRouter = require('./routes/UsReportFormRoute');// for user report form
var UsEditRouter = require('./routes/UsEditRoute');
var LogoutRouter = require("./routes/LogoutRoute")
const checkAccess = require('./middleware/Authenticate');

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

app.use('/AdCreateAccountRoute', AdCreateAccountRouter);
app.use('/AdLoginRoute', AdLoginRouter)
app.use('/AdTrackRoute', AdTrackRouter)
app.use('/AdManageBookingRoute', AdManageBookingRouter)
app.use('/AdDashboardRoute', AdDashboardRouter)
app.use('/AdManageRoomRoute', AdManageRoomRouter)

app.use('/UserRoute', UserRouter)
app.use('/AdminRoute', AdminRouter)
app.use('/UsProfileRoute', UsProfileRouter)
app.use('/UsBookRoute', UsBookRouter)
app.use('/UsLoginRoute', UsLoginRouter)
app.use('/UsReportFormRoute', UsReportFormRouter)
app.use('/UsScheduleRoute', UsScheduleRouter)
app.use('/UsReportSubmissionRoute', UsReportSubmissionRouter)
app.use('/UsEditRoute', UsEditRouter)
app.use('/LogoutRoute', LogoutRouter)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handle
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
