const express = require("express");
var mysql = require('mysql2/promise');
const router = express.Router();
const moment = require('moment');
const Book = require("../models/Book");
const checkAccess = require("../middleware/Authenticate");
const BookingReport = require("../models/BookingReport");

router.get("/",checkAccess, async function (req, res) {

    const UserId = req.session.UserId;
    const Username = req.session.Username;

    if (UserId) {
        let PendingDue = await new BookingReport().getUserDueReport(UserId)
        const BookingDatas = await new Book(UserId, null, null, null, null, null, null).ToGetToBeEvalutedBookings();
        res.render("UsReportSubmission", { Username: Username, BookingDatas: BookingDatas,PendingDue });
    } else {
        res.redirect("/UsLoginRoute")
    }
});


module.exports = router;