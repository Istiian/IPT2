const express = require("express");
const router = express.Router();
const Book = require("../models/Book");


router.get("/", async function (req, res) {
    
    
    

    const Quantity= {
        
        PendingReports : await new Book().GetQuantityPendingBookingReports(),
        Accepted : await new Book().GetQuantityAcceptedBookings(7),
        BookingPerRoom: await new Book().GetQuantityBookingsPerRoom(),
        DueReportsPerRoom: await new Book().GetQuantityDueReportsPerRoom(),
    }
    console.log("PendingReports", Quantity.PendingReports)
    res.render("AdDashboard", {
        title: "Dashboard",
        Quantity: Quantity,
    });
    
});

module.exports = router;