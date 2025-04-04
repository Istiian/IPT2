const moment = require('moment');
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

class Book {
    constructor(UserId = null, Username = null, RoomId = null, RoomName= null , BookingDate = null, StartTime = null, EndTime= null , Purpose= null) {
        this.UserId = UserId;
        this.Username = Username;
        this.RoomId = RoomId;
        this.RoomName = RoomName;
        this.BookingDate = BookingDate;
        this.StartTime = StartTime;
        this.EndTime = EndTime;
        this.Purpose = Purpose;
        
    }

    async Appoint(res) {
        const AppointmentDetails = {
            UserId: this.UserId,
            Username: this.Username,
            RoomId: this.RoomId,
            RoomName:this.RoomName,
            BookingDate: this.BookingDate,
            StartTime: this.StartTime,
            EndTime: this.EndTime,
            Purpose: this.Purpose
        }

        try {
            const Appointment = await connection.query('INSERT INTO booking SET ?', [AppointmentDetails]);
            res.redirect("/UsBookRoute?book=success")
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    async ToGetToBeEvalutedBookings() {
        const [BookingDatas] = await connection.query(`
            SELECT booking.*
            FROM booking LEFT JOIN bookingreport
            on booking.BookingId = bookingreport.BookingId
            WHERE bookingreport.BookingId IS null 
            AND booking.Decision = 1 AND UserId = ?
            AND (BookingDate < CURDATE() OR (BookingDate = CURDATE() AND ENDTIME <= CURTIME()))
            ORDER BY BookingDate ASC, StartTime ASC` , [this.UserId]);
        

        BookingDatas.forEach(Data => {
            Data.FormattedDate = moment(Data.BookingDate).format("MMMM Do YYYY")
            Data.FormattedStartTime = moment(Data.StartTime, "HH:mm").format("hh:mm A");
            Data.FormattedEndTime = moment(Data.EndTime, "HH:mm").format("hh:mm A");
            Data.FormattedNumericalDate = moment(Data.BookingDate).format("YYYY-MM-DD");
            Data.EncrpyedId = Buffer.from(Data.BookingId.toString()).toString('base64');
        });

        return BookingDatas;
    }

    async GetPendingBookings() {

        try {
            const [BookingDatas] = await connection.query("SELECT * FROM booking WHERE Decision IS NULL ORDER BY BookingDate ASC, StartTime ASC")
            return BookingDatas
        } catch (error) {
            console.error(error.message);
            
        }
    }

  
    
    
}

module.exports = Book;