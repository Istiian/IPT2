const express = require("express");
const router = express.Router()
const multer = require('multer'); // for file upload
const checkAccess = require("../middleware/Authenticate");
const BookingReport = require("../models/BookingReport");


router.get("/",checkAccess, async function(req,res){
    const UserId = req.session.UserId;
    const Username = req.session.Username;
    const {Id} = req.query;

    if(UserId){
        let PendingDue = await new BookingReport().getUserDueReport(UserId)
        res.render("UsReportForm", {UserId,Username,Id, PendingDue});
    }else{
        res.redirect("/UsLoginRoute")
    }
    
    
    
});

module.exports = router