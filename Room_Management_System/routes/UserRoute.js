const express = require("express");
const router = express.Router();
var mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const multer = require('multer'); // for file upload
const User = require("../models/User");
const Book = require("../models/Book");
const Booking = require("../models/BookingReport");
const { body, validationResult,matchedData  } = require('express-validator');

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

router.patch("/ChangePassword",
    [
        body("ConfirmPassword").trim().escape(),
        body("NewPassword").trim().escape(),
        body("CurrentPassword").trim().escape(),
    ]
    , async (req, res) => {

        const UserId = req.session.UserId;

        const Input = {
            ConfirmPassword: req.body.ConfirmPassword,
            NewPassword: req.body.NewPassword,
            CurrentPassword: req.body.CurrentPassword,
        };
        console.log(Input)
        try {
            const user = new User(null, Input.CurrentPassword);
            const hashedPasswordFromDb = await user.GetCurrentPassword(UserId);
            user.setPassword(hashedPasswordFromDb);
            const isMatch = await user.VerifyPassword(Input.CurrentPassword);
            if (!isMatch) {
                return res.redirect("/UsProfileRoute?ChangePass = Incorrect Current Password")
            }

            if (Input.NewPassword !== Input.ConfirmPassword) {
                return res.redirect("/UsProfileRoute?ChangePass = Password not match")
            }

            const newHashedPassword = await bcrypt.hash(Input.NewPassword, 10);
            let SqlStatement = `UPDATE user SET Password = ? WHERE UserId = ?`

            const [updateResult] = await connection.query(SqlStatement, [newHashedPassword, UserId]);
            res.redirect("/UsProfileRoute?ChangePass = Success")
        } catch (error) {
            console.error("Error changing password:", error);
        }
    })

router.post("/Book", [
    body("RoomId").trim().escape(),
    body("RoomName").trim().escape(),
    body("Date").trim().escape(),
    body("StartTime").trim().escape(),
    body("EndTime").trim().escape(),
    body("Purpose").trim().escape(),
], async (req, res) => {
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

    const BookDetails = new Book(Inputed.UserId, Inputed.Username, Inputed.RoomId, Inputed.RoomName, Inputed.Date, Inputed.StartTime, Inputed.EndTime, Inputed.Purpose);
    BookDetails.Appoint(res);
});

router.patch("/Book/Edit/:id", [
    body("RoomId").trim().escape(),
    body("RoomName").trim().escape(),
    body("Date").trim().escape(),
    body("StartTime").trim().escape(),
    body("EndTime").trim().escape(),
    body("Purpose").trim().escape(),
], async (req, res) => {

    const Inputed = {
        RoomId: req.body.RoomId,
        RoomName: req.body.RoomName,
        Date: req.body.Date,
        StartTime: req.body.StartTime,
        EndTime: req.body.EndTime,
        Purpose: req.body.Purpose,
        Bookingid: req.params.id
    }

    try {
        const Update = new Book(null, null, Inputed.RoomId, Inputed.RoomName, Inputed.Date, Inputed.StartTime, Inputed.EndTime, Inputed.Purpose).EditBooking(Inputed.Bookingid, res)
    } catch (error) {
        console.error(error.message)
    }

});

router.delete("/Book/Cancel/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const Delete = new Book().CancelBooking(id)
        res.redirect("/UsScheduleRoute")
    } catch (error) {
        console.error(error.message)
    }
});

router.post("/SubmitReport/:Id",
    upload.fields([
        { name: "BeforeImage", maxCount: 5 },
        { name: "AfterImage", maxCount: 5 }
    ]),
    async (req, res) => {
        await body("Remarks").trim().escape().run(req); // Run validator manually after multer

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const sanitizedData = matchedData(req);
        const Remarks = sanitizedData.Remarks;

        const { Id } = req.params;
        const beforeImagesPaths = req.files.BeforeImage.map(file => formatFilePath(file.path));
        const afterImagesPaths = req.files.AfterImage.map(file => formatFilePath(file.path));

        try {
            const SubmitReport = new Booking(Id, JSON.stringify(afterImagesPaths), JSON.stringify(beforeImagesPaths), Remarks);
            SubmitReport.ReportSubmission();
            res.redirect("/UsReportSubmissionRoute?Report=success");
        } catch (error) {
            console.error(error.message);
        }

        function formatFilePath(filePath) {
            return filePath.replace(/\\/g, '/').replace("public/", "")
        }
    }
);



module.exports = router