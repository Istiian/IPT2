const bcrypt = require('bcrypt');
const privateData = new WeakMap();// store key-value pairs, where the keys are objects and the values can be arbitrary values
var mysql = require('mysql2/promise');
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
    constructor(username, password, name, role, course = null, year = null, section = null, department = null) {
        this.username = username;
        privateData.set(this, { password }),
        this.name = name;
        this.role = role,
        this.course = course,
        this.year = year,
        this.section = section,
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
            const isMatch = await bcrypt.compare(password, this.getPassword());
            console.log("rESULT: ",isMatch)
            console.log("password: ", password)
            return isMatch;
        } catch (error) {
            console.error("Pass verification error!", error)
            return false;
        }
    }

    async isUsernameExist(username) {

        const [result] = await connection.query("SELECT username FROM user WHERE username = ?", [username]);

        console.log("Username: ", username);
        console.log("Database Check Result: ", result);


        if (result.length > 0) {
            console.log("Username exist?: ", "true")
            return true;
        } else {
            console.log("Username exist?: ", "false")
            return false;
        }
    }
    
    async CreateAccount(res) {
        const HashedPassword = await this.HashPassword(this.getPassword())

        if (!(await this.isUsernameExist(this.username))) {
            try {
                
                const NewUser = {
                    name: this.name,
                    username: this.username,
                    password: HashedPassword,
                    role: this.role
                }
                
                const [AddingUserInfo] = await connection.query('INSERT INTO user SET ?', NewUser);
                if (this.role == "Student") {
                    const newStudent = {
                        course: this.course,
                        year: this.year,
                        section: this.year,
                        userId: AddingUserInfo.insertId
                    }
                    const AddingStudentInfo = await connection.query('INSERT INTO student SET ?', newStudent)
                }
                else if (this.role == "Faculty") {
                    const newFaculty = {
                        Department: this.department,
                        userId: AddingUserInfo.insertId
                    }
                    const AddingFacultyInfo = await connection.query('INSERT INTO faculty SET ?', newFaculty)
                }
                res.redirect('/AdCreateAccountRoute?Created=true&Message=A new user is successfully created. ')

            } catch (err) {
                res.status(500).send(err.message);
            }
        } else {
            res.redirect('/AdCreateAccountRoute?Created=false&Message=Username Already Exist.')
        }
    }

    async ChangePasword(res) {

        if (await this.isUsernameExist(this.username)) {

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