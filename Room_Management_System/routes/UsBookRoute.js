const express = require("express");
const router = express.Router()
var mysql = require('mysql2/promise'); 

(async () => {
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '12345',
            database: 'room_management'
        });
        console.log('User: Connection Success');
    } catch (err) {
        console.error('Connection Not Success:', err.message);
    }
})();

router.get("/", async function(req,res){
    const UserId = req.session.UserId;
    const Username = req.session.Username;
    const [RoomInfos] = await connection.query("SELECT * FROM room");

    if(UserId){
        console.log(UserId)
        res.render("UsBook", {UserId,Username, RoomInfos: RoomInfos});
    }else{
        res.redirect("/UsLoginRoute");
    }
});

module.exports = router