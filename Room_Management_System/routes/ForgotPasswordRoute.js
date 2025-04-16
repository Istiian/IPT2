
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
var mysql = require('mysql2/promise');
require('dotenv').config();
const User = require("../models/User")
const { body, validationResult, matchedData } = require('express-validator');
const bcrypt = require('bcrypt');

(async () => {
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '12345',
            database: 'room_management'
        });
        console.log('Admin: Connection Success');
    } catch (err) {
        console.error('Connection Not Success:', err.message);
    }
})();

let Code
let Email
let Username
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.PASSWORD}`,
    },
});

router.get('/', async function (req, res) {
    res.render("UsForgotPasswordEmail")
})

router.post('/SendOTP', body("Username").trim().escape(), async function (req, res) {
    Username = req.body.Username
    const verifyUsername = await new User().isUsernameExist(Username)
    try {
        if (verifyUsername) {
            Email = await new User().getEmail(req.body.Username)
            Code = RandomCode()
            const info = await transporter.sendMail({
                from: `${process.env.EMAIL}`, // sender address
                to: `${Email}`, // list of receivers
                subject: "Your OTP Code: ", // Subject line
                text: `${Code}`, // plain text body
            });
    
            if (info) {
               res.redirect("/ForgotPasswordRoute/Form")
            }
        } else {
            res.redirect("/ForgotPasswordRoute?Username=NotExist")
        }
    } catch (error) {
        console.error(error.message)
    }
    
})

router.get("/Form", function (req,res){
    res.render("ForgotPassForm", { Email: maskedEmail(Email) })
});

router.patch("/ChangePass", [
    body("Code").trim().escape().isInt({ min: 6 }),
    body("Password").trim().escape(),
    body("ConfirmPassword").trim().escape(),
],
    async function (req, res) {
        const SentCode = req.body.Code;
        const Pass = req.body.Password;
        const ConfirmPass = req.body.ConfirmPassword

        try {
            if (parseInt(Code) === parseInt(SentCode)) {
                if(Pass===ConfirmPass){
                    const user = new User();
                    const UserId = await user.getUserId(Username)
                    console.log(UserId)
                    const hashedPasswordFromDb = await user.GetCurrentPassword(UserId);
                    console.log(hashedPasswordFromDb)
                    user.setPassword(hashedPasswordFromDb);
                    const newHashedPassword = await bcrypt.hash(Pass, 10);
                    let SqlStatement = `UPDATE user SET Password = ? WHERE UserId = ?`
                    const [updateResult] = await connection.query(SqlStatement, [newHashedPassword, UserId]);
                    res.redirect("/UsLoginRoute?ChangePass=Success")
                }
            } else {
                res.redirect("/ForgotPasswordRoute/Form?Code=NotMatch")
            }
        } catch (error) {
            console.error(error.message)
        }
    });

function RandomCode() {
    let Code = Math.floor((Math.random() * 999999) + 100000);
    return Code
}

function maskedEmail(email) {
    let atIndex = email.indexOf("@");
    let lastThree = email.slice(atIndex - 4, atIndex);
    let maskedEmail = "*".repeat(atIndex - 4) + lastThree + email.slice(atIndex);
    return maskedEmail
}

module.exports = router