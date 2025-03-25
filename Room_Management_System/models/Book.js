class Book{
    constructor(UserId,RoomId,RoomName, BookingDate, StartTime, EndTime, Purpose, Image = null){
        this.UserId = UserId;
        this.RoomId = RoomId;
        this.RoomName = RoomName;
        this.BookingDate = BookingDate;
        this.StartTime = StartTime;
        this.EndTime = EndTime;
        this.Purpose = Purpose;
        this.Image = Image;
    }

    async Appoint(res, connection){
        const AppointmentDetails = {
            UserId: this.UserId,
            RoomId: this.RoomId,
            BookingDate: this.BookingDate,
            StartTime: this.StartTime,
            EndTime: this.EndTime,
            Purpose: this.Purpose
        }

        try{
            const Appointment = await connection.query('INSERT INTO booking SET ?', AppointmentDetails);
            res.redirect("/UsBookRoute?book=success")
        }catch(err){
            res.status(500).send(err.message);
        }
    }
}

module.exports = Book;