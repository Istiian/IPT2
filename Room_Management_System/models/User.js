const bcrypt = require('bcrypt');
const express = require('express');
const privateData = new WeakMap();// store key-value pairs, where the keys are objects and the values can be arbitrary values
var mysql = require('mysql2/promise');
// const { connect } = require('../routes/AdminRoute');
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

class User {
    constructor(username, password, email, firstname, middlename,lastname,extensionname, department ) {
        this.username = username;
        privateData.set(this, { password }),
        this.email = email;
        this.firstname = firstname;
        this.middlename = middlename;
        this.lastname = lastname;
        this.extensionname = extensionname;
        this.department = department
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

    async VerifyPassword(password) {
        try {
            //Compare if the encrypted password from db matches the user's inputted password
            console.log(password, this.getPassword())
            const isMatch = await bcrypt.compare(password, this.getPassword());
            return isMatch;
        } catch (error) {
            console.error("Pass verification error!", error)
            return false;
        }
    }

    async isUsernameExist(username) {

        const [result] = await connection.query("SELECT username FROM user WHERE username = ?", [username]);

        if (result.length > 0) {   
            return true;
        } else {
            return false;
        }
    }
    
    async CreateAccount(res) {
        const HashedPassword = await this.HashPassword(this.getPassword())

        if (!(await this.isUsernameExist(this.username))) {
            try {
                
                const NewUser = {
                    firstname: this.firstname,
                    middlename: this.middlename,
                    lastname: this.lastname,
                    extensionname: this.extensionname,
                    username: this.username,
                    password: HashedPassword,
                    email: this.email,
                }

                const [AddingUserInfo] = await connection.query('INSERT INTO user SET ?', NewUser);
                
                res.redirect('/AdCreateAccountRoute?Created=true&Message=A new user is successfully created. ')

            } catch (err) {
                res.status(500).send(err.message);
            }
        } else {
            res.redirect('/AdCreateAccountRoute?Created=false&Message=Username Already Exist.')
        }
    }

    async GetInfo(UserId){
        let SqlStatement = "SELECT * FROM user WHERE UserId = ?"
        try {
            const [UserData] = await connection.query(SqlStatement, [UserId]);
            return [UserData][0]
        } catch (error) {
            console.log(error.message)
        } 
    }

    async GetCurrentPassword(UserId){
        try {
            let SqlStatement = "SELECT Password FROM user WHERE UserId = ?"
            const [Password] = await connection.query(SqlStatement, [UserId]);
            return Password[0].Password
        } catch (error) {
            console.error(error.message)
        }
    }
    async ChangePassword(New, Confirm, UserId){
       
        const CurrentPassword = await this.GetCurrentPassword(UserId);
        console.log('Plaintext password:', this.getPassword());
        console.log('Hashed password from DB:', CurrentPassword.password);

        // Compare passwords (note that bcrypt.compare returns a promise)
        const isMatch = await bcrypt.compare(CurrentPassword.password, this.getPassword());
        
        console.log(isMatch);


        // if(bcrypt.compare(password, this.getPassword())){
        //     console.log("match")
        // }else{
        //     console.log("Not match")
        // }
    }

    async Authenticate(){
        try {
            let SqlStatement = `SELECT Username, Password, UserId FROM user WHERE username = ?`;
            if (result.length > 0) {
                this.VerifyPassword(this.Password)
            }
                
        } catch (error) {
            console.error("Error in Authenticate: ", error)
            
        }
   
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
    }
}

module.exports = User;