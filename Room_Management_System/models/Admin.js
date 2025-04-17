const bcrypt = require('bcrypt');
const express = require('express');
const privateData = new WeakMap();
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

class Admin {
    constructor(username, password){
        this.username = this.username;
        privateData.set(this, { password })
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
  
        const [result] = await connection.query(`SELECT username FROM user WHERE username = ${username}`);

        if (result.length > 0) {   
            return true;
        } else {
            return false;
        }
    }
}

module.exports = Admin;