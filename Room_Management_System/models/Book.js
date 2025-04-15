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
        // console.log('User: Connection Success');
    } catch (err) {
        console.error('Connection Not Success:', err.message);
    }
})();

class Book {
    constructor(UserId = null, Username = null, RoomId = null, RoomName = null, BookingDate = null, StartTime = null, EndTime = null, Purpose = null) {
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
            RoomName: this.RoomName,
            BookingDate: this.BookingDate,
            StartTime: this.StartTime,
            EndTime: this.EndTime,
            Purpose: this.Purpose
        }

        try {
            let SqlStatement = `INSERT INTO booking SET ?`
            const Appointment = await connection.query(SqlStatement, [AppointmentDetails]);
            res.redirect("/UsBookRoute?book=success")
        } catch (err) {
            res.status(500).send(error.message);
        }
    }

    async EditBooking(BookingId, res) {
        try {
            let SqlStatement = `UPDATE booking 
            SET RoomId = ?, RoomName =  ?, BookingDate = ?, StartTime= ?, EndTime = ?, Purpose = ? 
            WHERE BookingId = ? `;
            const [BookingDatas] = await connection.query(SqlStatement, [
                this.RoomId,
                this.RoomName,
                this.BookingDate,
                this.StartTime,
                this.EndTime,
                this.Purpose,
                BookingId
            ]);
            res.redirect("/UsScheduleRoute?Edit=Sucess")
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async CancelBooking(BookingId) {
        try {
            let SqlStatement = `DELETE FROM booking WHERE BookingId = ?`
            const Delete = await connection.query(SqlStatement, [BookingId])
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async GetBookingDetails(BookingId) {
        try {
            let SqlStatement = "SELECT * FROM booking WHERE BookingId = ?"
            const [BookingDatas] = await connection.query(SqlStatement, [BookingId]);

            return this.DateTimeFormatting(BookingDatas)[0];
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    DateTimeFormatting(BookingDatas) {
        BookingDatas.forEach(Data => {
            Data.FormattedDate = moment(Data.BookingDate).format("MMMM Do YYYY");
            Data.FormattedStartTime = moment(Data.StartTime, "HH:mm").format("hh:mm A");
            Data.FormattedEndTime = moment(Data.EndTime, "HH:mm").format("hh:mm A");
            Data.FormattedNumericalDate = moment(Data.BookingDate).format("YYYY-MM-DD");
        });
        return BookingDatas;
    }


    async GetActiveUserBookings() {
        let SqlStatement = `SELECT *
            FROM booking 
            WHERE (BookingDate > CURDATE() OR (BookingDate = CURDATE() AND ENDTIME >= CURTIME())) AND userId = ?
            ORDER BY BookingDate ASC, StartTime ASC`;
        try {
            const [BookingDatas] = await connection.query(SqlStatement, [this.UserId]);

            return this.DateTimeFormatting(BookingDatas);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async ToGetToBeEvalutedBookings() {
        let SqlStatement = `
            SELECT booking.*
            FROM booking LEFT JOIN bookingreport
            on booking.BookingId = bookingreport.BookingId
            WHERE bookingreport.BookingId IS null 
            AND UserId = ?
            AND (BookingDate < CURDATE() OR (BookingDate = CURDATE() AND ENDTIME <= CURTIME()))
            ORDER BY BookingDate ASC, StartTime ASC`

        const [BookingDatas] = await connection.query(SqlStatement, [this.UserId]);

        BookingDatas.forEach(Data => {
            Data.FormattedDate = moment(Data.BookingDate).format("MMMM Do YYYY")
            Data.FormattedStartTime = moment(Data.StartTime, "HH:mm").format("hh:mm A");
            Data.FormattedEndTime = moment(Data.EndTime, "HH:mm").format("hh:mm A");
            Data.FormattedNumericalDate = moment(Data.BookingDate).format("YYYY-MM-DD");

        });

        return BookingDatas;
    }


    async GetQuantityOfBookings(Days) {
        let SqlStatement = `SELECT  COUNT(*) AS total_quantity
            FROM booking
            WHERE BookingDate >= NOW() - INTERVAL ? DAY;`;

        try {
            const [BookingDatas] = await connection.query(SqlStatement, [Days]);
            return BookingDatas[0].total_quantity;
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }

    async GetQuantityOfPendingBooking(Days) {
        let SqlStatement = `SELECT  COUNT(*) AS total_quantity
            FROM booking
            WHERE BookingDate >= NOW() - INTERVAL ? DAY AND Decision is NULL;`;

        try {
            const [BookingDatas] = await connection.query(SqlStatement, [Days]);
            return BookingDatas[0].total_quantity;
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }

    async GetQuantityAcceptedBookings(Days) {
        let SqlStatement = `SELECT COUNT(b.BookingId) as total_quantity
            FROM booking b
            LEFT JOIN bookingreport br
            ON b.BookingId = br.BookingId  AND b.BookingDate <= NOW()
            WHERE br.BookingId IS NULL
        `
        try {
            const [BookingDatas] = await connection.query(SqlStatement, [Days]);
            return BookingDatas[0].total_quantity;

        } catch (error) {
            res.status(500).send(error.message);

        }
    }


    async GetQuantityPendingBookingReports() {
        let SqlStatement = `SELECT COUNT(*) AS total_quantity
            FROM booking LEFT JOIN bookingreport
            on booking.BookingId = bookingreport.BookingId
            WHERE bookingreport.BookingId IS null 
            AND (BookingDate < CURDATE() OR (BookingDate = CURDATE() AND ENDTIME <= CURTIME()))
            ORDER BY BookingDate ASC, StartTime ASC`;

        try {
            const [BookingDatas] = await connection.query(SqlStatement);
            return BookingDatas[0].total_quantity;
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }

    async GetQuantityBookingsPerRoom(Days = 7) {

        let SqlStatement = `SELECT r.RoomId, COUNT(b.BookingId) AS total_quantity
            FROM room r
            LEFT JOIN booking b
            ON r.RoomId = b.RoomId AND (BookingDate > CURDATE() OR (BookingDate = CURDATE() AND ENDTIME >= CURTIME()))
            GROUP BY r.RoomId
            `

        try {
            const [BookingDatas] = await connection.query(SqlStatement, [Days]);
            return BookingDatas;
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }

    async GetQuantityDueReportsPerRoom() {
        let SqlStatement = `SELECT r.Room_Name,
                    COUNT(CASE 
                        WHEN b.BookingId IS NOT NULL AND br.BookingId IS NULL THEN 1
                        ELSE NULL
                    END) AS total_quantity
                FROM  room r
                LEFT JOIN booking b 
                    ON r.RoomId = b.RoomId
                    AND (b.BookingDate < CURDATE() OR (b.BookingDate = CURDATE() AND b.EndTime <= CURTIME()))
                    
                LEFT JOIN bookingreport br 
                    ON b.BookingId = br.BookingId
                GROUP BY 
                    r.RoomId, r.Room_Name;`

        try {
            const [BookingDatas] = await connection.query(SqlStatement);
            return BookingDatas;
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async GetDueReportsDetails(RoomId) {
        if (RoomId) {
            let SqlStatement = `SELECT booking.*
            FROM booking LEFT JOIN bookingreport
            on booking.BookingId = bookingreport.BookingId
            WHERE bookingreport.BookingId IS null 
            AND booking.RoomId = ?
            AND (BookingDate < CURDATE() OR (BookingDate = CURDATE() AND ENDTIME <= CURTIME()))
            ORDER BY BookingDate ASC, StartTime ASC`

            try {
                const [BookingDatas] = await connection.query(SqlStatement, [RoomId]);
                return BookingDatas;
            } catch (error) {
                res.status(500).send(error.message);
            }
        } else {
            let SqlStatement = `SELECT booking.*
            FROM booking LEFT JOIN bookingreport
            on booking.BookingId = bookingreport.BookingId
            WHERE bookingreport.BookingId IS null 
            AND (BookingDate < CURDATE() OR (BookingDate = CURDATE() AND ENDTIME <= CURTIME()))
            ORDER BY BookingDate ASC, StartTime ASC`

            try {
                const [BookingDatas] = await connection.query(SqlStatement);
                return BookingDatas;
            } catch (error) {
                res.status(500).send(error.message);
            }
        }

    }

    async GetActiveReservation(Id) {
        let SqlStatement = `SELECT * FROM booking 
        WHERE booking.RoomId = ?
        AND (BookingDate > CURDATE() OR (BookingDate = CURDATE() AND ENDTIME >= CURTIME()))
        ORDER BY BookingDate ASC, StartTime ASC`;

        try {
            const [BookingDatas] = await connection.query(SqlStatement, [Id]);
            return BookingDatas;
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async getQuantityHistory(){
        let SqlStatement = `SELECT COUNT(br.BookingReportId) AS total_quantity
            FROM booking b
            LEFT JOIN bookingreport br
            ON b.BookingId = br.BookingId 
            WHERE br.BookingReportId IS NOT NULL
        `
        try {
            const [BookingDatas] = await connection.query(SqlStatement);
            return BookingDatas[0].total_quantity;
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }
    async getHistoryBooking(RoomId, BookingId) {

        if (RoomId) {
            let SqlStatement = `SELECT br.BookingReportId, b.RoomName, b.StartTime, b.EndTime,b.BookingDate, b.Username, br.AfterImages, br.BeforeImages, br.Remarks 
            FROM booking b
            LEFT JOIN bookingreport br
            ON b.BookingId = br.BookingId 
            WHERE br.BookingReportId IS NOT NULL AND b.RoomId = ?`;

            try {
                const [BookingDatas] = await connection.query(SqlStatement, [RoomId]);
                return BookingDatas
            } catch (error) {
                res.status(500).send(error.message);
            }

        } else if (BookingId) {

            let SqlStatement = `SELECT br.BookingReportId, b.RoomName, b.StartTime, b.EndTime,b.BookingDate, b.Username, br.AfterImages, br.BeforeImages, br.Remarks 
            FROM booking b
            LEFT JOIN bookingreport br
            ON b.BookingId = br.BookingId 
            WHERE br.BookingReportId IS NOT NULL AND br.BookingReportId = ?`;

            try {
                const [BookingDatas] = await connection.query(SqlStatement, [BookingId]);
                return BookingDatas
            } catch (error) {
                res.status(500).send(error.message);
            }
        }
    }

    async getHistoryBookingQuantity() {
        try {
            let SqlStatement = `SELECT COUNT( br.BookingReportId) AS total_quantity
            FROM room r
            LEFT JOIN booking b
            ON r.RoomId = b.RoomId
            LEFT JOIN bookingreport br
            ON b.BookingId = br.BookingId
            GROUP BY r.RoomId`;
            const [BookingData] = await connection.query(SqlStatement);
            return BookingData
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }
}
module.exports = Book;