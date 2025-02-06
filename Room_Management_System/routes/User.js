const express = require("express");
const router = express.Router();
var mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');


router.get("/", function (req, res) {
    res.send("Success")
});

(async () => {
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '12345',
            database: 'room_management'
        });
        // console.log('User: Connection Success');
    } catch (err) {
        console.error('Connection Not Success:', err.message);
    }
})();



router.post("/Login", async (req, res) => {
    const Inputed = {
        username: req.body.Username,
        password: req.body.Password
    }

    const [result] = await connection.query("SELECT * FROM user WHERE username = ?", [Inputed.username])

    if (result.length > 0) {
        const user = new User(result[0].Username,
            result[0].Password,
            result[0].Course,
            result[0].Year,
            result[0].Section
        )
        console.log(await user.VerifyPassword(Inputed.password))
        if (await user.VerifyPassword(Inputed.password)) {
            console.log("welcome")
        } else {
            console.log("Not Welcome")
        }

    } else {
        console.log("Username does not Exist")
    }
})

const privateData = new WeakMap();

class User {

    constructor(username, password, course, year, section) {
        this.username = username,
        privateData.set(this, { password }),
        this.course = course,
        this.year = year,
        this.section = section
    }

    getPassword() {
        return privateData.get(this).password;
    }

    async VerifyPassword(password) {
        try {
            //Compare if the encrypted password from db matches the user's inputted password
            const isMatch = await bcrypt.compare(password,  this.getPassword());
            return isMatch;
        } catch (error) {
            console.error("Pass verification error!", error)
            return false;
        }
    }
}


module.exports = router