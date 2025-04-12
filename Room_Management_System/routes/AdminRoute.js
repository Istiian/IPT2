const express = require("express");
const router = express.Router();
var mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const User = require("../models/User");
const Book = require("../models/Book");

const { body, validationResult } = require('express-validator');

// Connection on the DB
(async () => {
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '12345',
            database: 'room_management'
        });
    } catch (err) {
        console.error('Connection Not Success:', err.message);
    }
})();

router.post("/CreateAccount", [
    body("Username").trim().escape(),
    body("Password").trim().escape(),
    body("Email").trim().escape(),
    body("FirstName").trim().escape(),
    body("MiddleName").trim().escape(),
    body("LastName").trim().escape(),
    body("ExtensionName").trim().escape(),
    body("Department").trim().escape(),
], async (req, res) => {

    const NewUser = new User(
        req.body.Username,
        req.body.Password,
        req.body.Email,
        req.body.FirstName,
        req.body.MiddleName,
        req.body.LastName,
        req.body.ExtensionName,
        req.body.Department,
    )
    await NewUser.CreateAccount(res);
})

module.exports = router