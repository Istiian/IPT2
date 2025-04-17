
const express = require("express");
const checkAccess = require("../middleware/Authenticate");
const router = express.Router()
const BookingReport = require("../models/BookingReport");

router.get("/", checkAccess, async function(req,res){
    const error = req.query.Error;
    const UserId = req.session.UserId;
    const Username = req.session.Username

    if(UserId){
        let PendingDue = await new BookingReport().getUserDueReport(UserId)
        res.render("UsEdit", {error, UserId, Username, PendingDue});
    }else{
        res.redirect("/UsLoginRoute")
    }
    
});

module.exports = router;