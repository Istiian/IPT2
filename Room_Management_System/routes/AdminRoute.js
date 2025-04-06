const express = require("express");
const router = express.Router();
var mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const User = require("../models/User");
const Book = require("../models/Book");
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
        req.body.Email,
        req.body.Name,
        req.body.Role,
        req.body.Course,
        req.body.Year,
        req.body.Section,
        req.body.Department,
    )

    await NewUser.CreateAccount(res);

})

router.patch("/ChangePassword", async (req, res) => {
    const username = req.body.Username;
    const newPassword = req.body.Password;
    const user = new User(String(username), String(newPassword));
    await user.ChangePasword(res);
})

router.patch("/DecideBooking/:id", async(req, res) =>{
    const {id} = req.params
    const {Decision} = req.body
    let conflicts = JSON.parse(req.body.Conflicts || "[]"); 
    console.log(conflicts)
    if(conflicts.length > 0){
        for (let id of conflicts){
            await connection.query("UPDATE booking SET Decision = 0 WHERE BookingId = ?", [id])
        }
    }
    const MakeDecision = await connection.query("UPDATE booking SET Decision = ? WHERE BookingId = ?", [Decision, id])
    
    
    res.redirect(`/AdManageRoomRoute/Reservation/${id}?Decision=success`)
})



module.exports = router