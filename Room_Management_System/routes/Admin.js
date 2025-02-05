const express = require("express");
const router = express.Router();
var mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// Connection on the DB
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

router.get("/", function (req, res) {
    res.send("")
});


router.post("/CreateAccount", async (req, res) => {
    const NewUser = new User(
        req.body.Username,
        req.body.Password,
        req.body.Course,
        req.body.Year,
        req.body.Section
    )

    await NewUser.CreateAccount(res);

})

router.patch("/ChangePassword", async (req, res) => {
    const username = req.body.Username;
    const newPassword = req.body.Password;

    const user = new User(String(username), String(newPassword));


    await user.ChangePasword(res);

})

const privateData = new WeakMap();// store key-value pairs, where the keys are objects and the values can be arbitrary values

class User {
    constructor(username, password, course, year, section) {
        this.username = username;
        privateData.set(this, { password }),
            this.course = course,
            this.year = year,
            this.section = section
    }

    getPassword() {
        return privateData.get(this).password;
    }

    setPassword(newPassword) {
        const data = privateData.get(this); // Retrieve the private data
        data.password = newPassword;        // Update the password
        privateData.set(this, data);        // Store the updated data back in the WeakMap
    }

    async HashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    async CheckUsername(username) {
        console.log("Checking username:", username);
        const [result] = await connection.query("SELECT username FROM user WHERE username = ?", [username]);
        console.log([result])
        if (result.length > 0) {
            console.log("false")
            return false;
        } else {
            console.log("true")
            return true;
        }
    }

    async CreateAccount(res) {
        const HashedPassword = await this.HashPassword(this.getPassword())

        if (await this.CheckUsername(this.username)) {
            try {
                const NewUser = {
                    course: this.course,
                    year: this.year,
                    section: this.section,
                    username: this.username,
                    password: HashedPassword
                }
                const result = await connection.query('INSERT INTO user SET ?', NewUser);
                res.redirect('/SignUp?Created=true&Message=hiii')

            } catch (err) {
                res.status(500).send(err.message);
            }
        } else {
            res.redirect('/SignUp?Created=false&Message=Username Already Exist')
        }
    }

    async ChangePasword(res) {
        try {
            console.log(this.username)
            console.log(this.getPassword())
            console.log()
            const hashedNewPassword = await this.HashPassword(this.getPassword());
            console.log(hashedNewPassword)
            const result = await connection.query('UPDATE user SET Password = ? WHERE username = ? ', [hashedNewPassword, this.username]);
            
            console.log("NewPassword: ", hashedNewPassword)
            
            res.send("Updated")
        } catch (err) {
            res.status(500).send(err.message);
        }

    }
}

module.exports = router