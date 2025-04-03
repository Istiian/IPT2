const express = require("express");
const router = express.Router();
var mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const multer = require('multer'); // for file upload
const User = require("../models/User");
const Book = require("../models/Book");

router.get("/", function (req, res) {
    res.send("Success")
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/BookingImages') // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

router.post("/Login", async (req, res) => {
    const Inputed = {
        username: req.body.Username,
        password: req.body.Password
    }

    const [result] = await connection.query("SELECT Username, Password, UserId FROM user WHERE username = ?", [Inputed.username])
   
    if (result.length > 0) {
        const user = new User(result[0].Username,
            result[0].Password,
            // result[0].Course,
            // result[0].Year,
            // result[0].Section
        )
        if (await user.VerifyPassword(Inputed.password)) {
            req.session.UserId = result[0].UserId;
            req.session.Username = result[0].Username;
            res.redirect("/UsBookRoute")
        } else {
            res.redirect('/UsLoginRoute?Error=true')
        }
    } else {
        console.log("Error")
        res.redirect('/UsLoginRoute?Error=true')
    }
});

router.post("/Book", async (req, res) =>{
    const Inputed = {
        UserId: req.session.UserId,
        Username: req.session.Username,
        RoomId: req.body.RoomId, 
        RoomName: req.body.RoomName,
        Date: req.body.Date,
        StartTime: req.body.StartTime,
        EndTime: req.body.EndTime,
        Purpose: req.body.Purpose
    }
    console.log("Username: ", req.session.Username)
    console.log(Inputed);
    const BookDetails =  new Book(Inputed.UserId, Inputed.Username, Inputed.RoomId, Inputed.RoomName, Inputed.Date, Inputed.StartTime, Inputed.EndTime, Inputed.Purpose);
    BookDetails.Appoint(res);
});

router.patch("/SubmitReport/:Id", upload.fields([{name: "BeforeImage", maxCount: 5}, {name: "AfterImage", maxCount: 5} ]), async (req, res) => {
    const {Id} = req.params;
    const beforeImagesPaths = req.files.BeforeImage.map(file => formatFilePath(file.path)); // Array of paths for "BeforeImage"
    const afterImagesPaths = req.files.AfterImage.map(file => formatFilePath(file.path));   // Array of paths for "AfterImage"
    const Remarks = req.body.Remarks;
    
    const SubmitReport = new Book(req.session.UserId, req.session.Username, null, null, null, null, null, null, Id, JSON.stringify(afterImagesPaths), JSON.stringify(beforeImagesPaths), Remarks).ReportSubmission();

    function formatFilePath(filePath) {
        return filePath.replace(/\\/g, '/').replace("public/", "")
    }
})



module.exports = router