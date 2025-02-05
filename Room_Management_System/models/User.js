const bcrypt = require('bcrypt');
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

    async VerifyPassword(password) {
        try {
            //Compare if the encrypted password from db matches the user's inputted password
            const isMatch = await bcrypt.compare(password, this.getPassword());
            return isMatch;
        } catch (error) {
            console.error("Pass verification error!", error)
            return false;
        }
    }

    async isUsernameExist(username, connection) {

        const [result] = await connection.query("SELECT username FROM user WHERE username = ?", [username]);
        console.log("Username: ", username)
        console.log("Database Check Result: ", result);


        if (result.length > 0) {
            console.log("Username exist?: ", "true")
            return true;
        } else {
            console.log("Username exist?: ", "false")
            return false;
        }
    }

    async CreateAccount(res, connection) {
        const HashedPassword = await this.HashPassword(this.getPassword())

        if (!(await this.isUsernameExist(this.username, connection))) {
            try {
                const NewUser = {
                    course: this.course,
                    year: this.year,
                    section: this.section,
                    username: this.username,
                    password: HashedPassword
                }
                const result = await connection.query('INSERT INTO user SET ?', NewUser);
                res.redirect('/SignUpRoute?Created=true&Message=hiii')

            } catch (err) {
                res.status(500).send(err.message);
            }
        } else {
            res.redirect('/SignUpRoute?Created=false&Message=Username Already Exist')
        }
    }

    async ChangePasword(res, connection) {

        if (await this.isUsernameExist(this.username, connection)) {

            try {
                const hashedNewPassword = await this.HashPassword(this.getPassword());
                console.log(hashedNewPassword)
                const result = await connection.query('UPDATE user SET Password = ? WHERE username = ? ', [hashedNewPassword, this.username]);

                res.redirect('/ChangePassRoute?Change=true&Message=Success')


            } catch (err) {
                res.status(500).send(err.message);
            }
        } else {
            res.redirect('/ChangePassRoute?Change=False&Message=Username does not exist')
        }
    }
}

module.exports = User;