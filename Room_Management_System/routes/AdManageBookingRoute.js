
var express = require("express");
var router = express.Router();
var mysql = require('mysql2/promise');
const moment = require('moment');



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


router.get("/", async function(req, res) {
    const [BookingDatas] = await connection.query("SELECT * FROM booking WHERE Decision IS NULL ORDER BY BookingDate DESC, StartTime desc")
    
    BookingDatas.forEach(Data => {
        Data.FormattedDate = moment(Data.BookingDate).format("MMMM Do YYYY")
        Data.FormattedStartTime = moment(Data.StartTime, "HH:mm").format("hh:mm A");
        Data.FormattedEndTime = moment(Data.EndTime, "HH:mm").format("hh:mm A");
        Data.FormattedNumericalDate = moment(Data.BookingDate).format("YYYY-MM-DD")
    });

    

    res.render("AdManageBooking", {BookingDatas:BookingDatas });
    
    
});

module.exports = router;
