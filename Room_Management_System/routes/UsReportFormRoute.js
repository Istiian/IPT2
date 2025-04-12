const express = require("express");
const router = express.Router()
const multer = require('multer'); // for file upload
const checkAccess = require("../middleware/Authenticate");



router.get("/",checkAccess, function(req,res){
    const UserId = req.session.UserId;
    const Username = req.session.Username;
    const {Id} = req.query;

    res.render("UsReportForm", {UserId,Username,Id});
    
    
});

module.exports = router