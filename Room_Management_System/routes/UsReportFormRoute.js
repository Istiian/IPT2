const express = require("express");
const router = express.Router()
const multer = require('multer'); // for file upload

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/BookingImages') // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })


router.get("/", function(req,res){
    const UserId = req.session.UserId;
    const Username = req.session.Username;
    const {Id} = req.query;

    res.render("UsReportForm", {UserId,Username,Id});
    
    
});

module.exports = router