const Book = require("./Book");
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


class BookingReport extends Book{
    constructor(BookingId, AfterImages, BeforeImages, Remarks) {
        super();
        this.BookingId = BookingId;
        this.AfterImages = AfterImages;
        this.BeforeImages = BeforeImages;
        this.Remarks = Remarks;
    }

    async ReportSubmission(){
            const ReportDetails = {
                BookingId: this.BookingId,
                AfterImages: this.AfterImages,
                BeforeImages: this.AfterImages,
                Remarks: this.Remarks
            }
    
            try {
                let SqlStatement = `INSERT INTO bookingreport SET ?`
                const Report = await connection.query(SqlStatement, [ReportDetails]);
                console.log("Success: ", Report)
            } catch (err) {
                console.error(err.message);
            }
    
        }
    async getUserDueReport(UserId){
        try {
            let SqlStatement = `SELECT count(b.UserId) AS DueReport
                FROM booking b
                LEFT JOIN bookingreport br
                ON b.bookingId = br.BookingId WHERE br.BookingId IS NULL AND b.BookingDate <= NOW() AND b.UserId = ?;`
            const [Data] = await connection.query(SqlStatement, [UserId]);
            return Data[0].DueReport;
        } catch (error) {
            console.error(error.message)
        }
    }
}

module.exports = BookingReport;