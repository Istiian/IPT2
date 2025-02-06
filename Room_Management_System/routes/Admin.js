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
        // console.log('Admin: Connection Success');
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

class User {
    constructor(username, password, course, year, section) {
        this.username = username;
        this.password = password,
        this.course = course,
        this.year = year,
        this.section = section
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
        const HashedPassword = await this.HashPassword(this.password)

        if(await this.CheckUsername(this.username)){
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
        }else{
            res.redirect('/SignUp?Created=false&Message=Username Already Exist')
        }

        // try {
        //     const NewUser = {
        //         course: this.course,
        //         year: this.year,
        //         section: this.section,
        //         username: this.username,
        //         password: HashedPassword
        //     }
        //     this.CheckUsername()
        //     const result = await connection.query('INSERT INTO user SET ?', NewUser);
        //     res.redirect('/SignUp?Created=true&Message=hiii')

        // } catch (err) {
        //     res.status(500).send(err.message);
        // }
    }
}

module.exports = router