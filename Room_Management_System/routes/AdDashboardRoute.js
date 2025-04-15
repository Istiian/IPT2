const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

const checkAccess = require("../middleware/Authenticate");



router.get("/",checkAccess, async function (req, res) {
    
    
    const UserId = req.session.UserId;
    const Username = req.session.Username;

    if(UserId){
        const Quantity= {
            PendingReports : await new Book().GetQuantityPendingBookingReports(),
            Accepted : await new Book().GetQuantityAcceptedBookings(7),
            BookingPerRoom: await new Book().GetQuantityBookingsPerRoom(),
            DueReportsPerRoom: await new Book().GetQuantityDueReportsPerRoom(),
            History: await new Book().getQuantityHistory()
        }
        res.render("AdDashboard", {
            title: "Dashboard",
            Quantity: Quantity,
            Username: Username
        });
    }else{
        res.redirect("/AdLoginRoute")
    }

    
    
});

module.exports = router;