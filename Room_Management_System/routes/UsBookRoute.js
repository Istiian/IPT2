const express = require("express");
const router = express.Router()
const moment = require("moment-timezone")
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


router.get("/", async function (req, res) {


    const UserId = req.session.UserId;
    const Username = req.session.Username;
    const [RoomInfos] = await connection.query("SELECT * FROM room");
    
    

    async function AddSchedule(RoomInfos) {
        for (const RoomInfo of RoomInfos) {
            let [FixedSched] = await connection.query(`SELECT * FROM schedule WHERE RoomId = ${RoomInfo.RoomId}`);
            let [BookSched] = await connection.query(`SELECT * FROM booking WHERE RoomId = ${RoomInfo.RoomId}`);
            let FullSched = [];

            if (Array.isArray(FixedSched) && FixedSched.length > 0) {
                FixedSched.forEach(Sched => {
                    let events = FixedEvents(Sched.ScheduledDay, Sched.StartTime, Sched.EndTime);
                    FullSched.push(...events);
                });
            }

            if (Array.isArray(BookSched) && BookSched.length > 0) {
                BookSched.forEach(Sched => {
                    let formattedDate = moment(Sched.BookingDate).tz('Asia/Manila').format("YYYY-MM-DD HH:mm:ss");
                    console.log("raw: ", Sched.BookingDate )
                    console.log("formatted: ", formattedDate )
                    let events = BookEvents(formattedDate, Sched.StartTime, Sched.EndTime);
                    FullSched.push(...events);
                });
            }
            RoomInfo.FullSchedule = FullSched
        }
        return RoomInfos;
    }

    const updatedRoomInfos = await AddSchedule(RoomInfos);
    
    

    function BookEvents(SchedDate, StartTime, Endtime) {
        let events = []
        let DateStr = new Date(SchedDate).toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' });

       
       console.log("start: ", `${DateStr}T${StartTime}`)

        events.push({
            title: "Book",
            start: `${DateStr}T${StartTime}`,
            end: `${DateStr}T${Endtime}`,
        });

        console.log(events)
        return events
    }

    function FixedEvents(Day, StartTime, EndTime) {
        let indexDay;
        let events = []
        switch (Day) {
            case "Sunday": indexDay = 0; break;
            case "Monday": indexDay = 1; break;
            case "Tuesday": indexDay = 2; break;
            case "Wednesday": indexDay = 3; break;
            case "Thursday": indexDay = 4; break;
            case "Friday": indexDay = 5; break;
            case "Saturday": indexDay = 6; break;
        }

        let startDate = new Date("2025-03-20"); // Start date
        let endDate = new Date("2025-04-24");   // End date
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            if (currentDate.getDay() === indexDay) {
                let dateStr = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format

                events.push({ // Push to array instead of overwriting
                    title: "Fix",
                    start: `${dateStr}T${StartTime}`,
                    end: `${dateStr}T${EndTime}`,

                });
            }
            currentDate.setDate(currentDate.getDate() + 1);
            
        }
       
        return events;
    }

    
    if (UserId) {
        res.render("UsBook", { UserId, Username, RoomInfos: updatedRoomInfos });
        
    } else {
        res.redirect("/UsLoginRoute");
    }
    
});

module.exports = router