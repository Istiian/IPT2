const express = require("express");
const router = express.Router();
const Book = require("../models/Book");


router.get("/", async function (req, res) {
    
    const BookingPerRoom = await new Book().GetAcceptedBookingsPerRoom();
    

    const Quantity= {
        Rejected : await new Book().GetRejectedBookings(7),
        PendingReports : await new Book().GetPendingBookingReports(),
        Accepted : await new Book().GetAcceptedBookings(7),
        Pending: await new Book().GetQuantityOfPendingBooking(7),
        BookingPerRoom: BookingPerRoom,
    }

    

    res.render("AdDashboard", {
        title: "Dashboard",
        Quantity: Quantity,
       
        
    });
});

module.exports = router;