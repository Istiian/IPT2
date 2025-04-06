const express = require("express");
const router = express.Router();
const Book = require("../models/Book");


router.get("/", async function (req, res) {
    
    // const BookingPerRoom = await new Book().GetAcceptedBookingsPerRoom();
    

    const Quantity= {
        Rejected : await new Book().GetQuantityRejectedBookings(7),
        PendingReports : await new Book().GetQuantityPendingBookingReports(),
        Accepted : await new Book().GetQuantityAcceptedBookings(7),
        Pending: await new Book().GetQuantityOfPendingBooking(7),
        BookingPerRoom: await new Book().GetQuantityAcceptedBookingsPerRoom(),
        PendingBookingPerRoom: await new Book().GetQuantityOfPendingBookingPerRoom(),
        DueReportsPerRoom: await new Book().GetQuantityDueReportsPerRoom(),
    }

    res.render("AdDashboard", {
        title: "Dashboard",
        Quantity: Quantity,
    });
    
});

module.exports = router;