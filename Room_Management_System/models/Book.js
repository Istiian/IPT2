class Book{
    constructor(UserId,RoomId,RoomName, BookingDate, StartTime, EndTime, Reason, Image = null){
        this.UserId = UserId;
        this.RoomId = RoomId;
        this.RoomName = RoomName;
        this.BookingDate = BookingDate;
        this.StartTime = StartTime;
        this.EndTime = EndTime;
        this.Reason = Reason;
        this.Image = Image;
    }

    async Appoint(res, connection){
        const AppointmentDetails = {
            UserId: this.UserId,
            RoomId: this.RoomId,
            BookingDate: this.BookingDate,
            StartTime: this.StartTime,
            EndTime: this.EndTime,
            Reason: this.Reason
        }


        try{
            const Appointment = await connection.query('INSERT INTO booking SET ?', AppointmentDetails);
        }catch(err){
            res.status(500).send(err.message);
        }
    }
}

module.exports = Book;