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
                const Report = await connection.query('INSERT INTO bookingreport SET ?', [ReportDetails]);
                console.log("Success: ", Report)
            } catch (err) {
                console.error(err.message);
            }
    
        }
}

module.exports = BookingReport;