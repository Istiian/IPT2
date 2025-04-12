
var express = require("express");
var router = express.Router();
var mysql = require('mysql2/promise');
const moment = require('moment');
const Book = require("../models/Book");
const checkAccess = require("../middleware/Authenticate");
const User = require("../models/User");

(async () => {
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '12345',
            database: 'room_management'
        });
    } catch (err) {
        console.error('Connection Not Success:', err.message);
    }
})();


router.get("/", checkAccess, async function (req, res) {
    const UserId = req.session.UserId;
    const Username = req.session.Username;

    if (UserId) {
        const BookingDatas = await new Book().GetPendingBookings();
        BookingDatas.forEach(Data => {
            Data.FormattedDate = moment(Data.BookingDate).format("MMMM Do YYYY");
            Data.FormattedStartTime = moment(Data.StartTime, "HH:mm").format("hh:mm A");
            Data.FormattedEndTime = moment(Data.EndTime, "HH:mm").format("hh:mm A");
            Data.FormattedNumericalDate = moment(Data.BookingDate).format("YYYY-MM-DD");
        });
        res.render("AdManageBooking", { BookingDatas: BookingDatas, Username });
    } else {
        res.redirect("/AdLoginRoute")
    }


});

module.exports = router;
