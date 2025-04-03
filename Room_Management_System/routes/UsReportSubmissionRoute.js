const express = require("express");
var mysql = require('mysql2/promise');
const router = express.Router();
const moment = require('moment');
const Book = require("../models/Book");

// (async () => {
//     try {
//         connection = await mysql.createConnection({
//             host: 'localhost',
//             user: 'root',
//             password: '12345',
//             database: 'room_management'
//         });
//         console.log('User: Connection Success');
//     } catch (err) {
//         console.error('Connection Not Success:', err.message);
//     }
// })();

router.get("/", async function (req, res) {

    const UserId = 1;
    const Username = "Forlaje3G";

    const BookingDatas = await new Book(UserId, null, null, null, null, null, null).ToGetToBeEvalutedBookings();

    console.log("BookingDatas", BookingDatas)

    if(UserId){
    res.render("UsReportSubmission", { Username: Username, BookingDatas: BookingDatas });

    }else{

        res.redirect("/UsLoginRoute")
    }


    // async function getBookingData(connection) {
    //     const [BookingDatas] = await connection.query(`SELECT * FROM booking WHERE UserId = 1 AND Decision = 1 ORDER BY BookingDate ASC, StartTime ASC`);
    //     let udpdatedBookingDatas = []

    //     BookingDatas.forEach(Data => {
    //         Data.FormattedDate = moment(Data.BookingDate).format("MMMM Do YYYY")
    //         Data.FormattedStartTime = moment(Data.StartTime, "HH:mm").format("hh:mm A");
    //         Data.FormattedEndTime = moment(Data.EndTime, "HH:mm").format("hh:mm A");
    //         Data.FormattedNumericalDate = moment(Data.BookingDate).format("YYYY-MM-DD");

    //         if (IsTimeHavePassed(Data.FormattedNumericalDate, Data.EndTime)) {
    //             udpdatedBookingDatas.push(Data)
    //         } else {

    //         }
    //     });
    //     console.log("udpdatedBookingDatas", udpdatedBookingDatas)
    //     return udpdatedBookingDatas;
    // }

    // function IsTimeHavePassed(EndDate, EndTime) {
    //     let BookingEndTime = new Date(`${EndDate}T${EndTime}`);
    //     let CurrentDate = new Date();
    //     if (CurrentDate > BookingEndTime) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
});


module.exports = router;