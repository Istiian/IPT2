const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const moment = require("moment-timezone");
const checkAccess = require("../middleware/Authenticate");
const BookingReport = require("../models/BookingReport");

router.get("/",checkAccess, async function (req, res) {
    const UserId = req.session.UserId;
    const Username = req.session.Username;
    const Edit = req.query.Edit;
    const Cancel = req.query.Cancel;
    if (UserId) {
        let SqlStatement = "SELECT * FROM room"
        const [RoomInfos] = await connection.query(SqlStatement);
        const updatedRoomInfos = await AddSchedule(RoomInfos);
        const BookingDatas = await new Book(UserId).GetActiveUserBookings();
        let PendingDue = await new BookingReport().getUserDueReport(UserId)
        res.render("UsSchedule", { UserId, Username, BookingDatas, BookingPerRoom: updatedRoomInfos, PendingDue,Edit,Cancel });
    } else {
        res.redirect("/UsLoginRoute?Error=Please login first");
    }
});

router.get("/Edit/:id", async function (req, res) {
    const UserId = req.session.UserId;
    const Username = req.session.Username;
    const id = req.params.id
    
    try {
        let SqlStatement = "SELECT * FROM room"
        const [RoomInfos] = await connection.query(SqlStatement);

        const updatedRoomInfos = await AddSchedule(RoomInfos);
        let PendingDue = await new BookingReport().getUserDueReport(UserId)
        const BookingData = await new Book().GetBookingDetails(id);
        res.render('UsEdit', { UserId, Username, BookingData, BookingPerRoom: updatedRoomInfos,PendingDue })
    } catch (error) {
        console.error(error.message)
    }
});

async function AddSchedule(RoomInfos) {
    for (const RoomInfo of RoomInfos) {
        let FixedStatement = `SELECT * FROM schedule WHERE RoomId = ${RoomInfo.RoomId}`;
        let BookStatement = `SELECT * FROM booking WHERE RoomId = ${RoomInfo.RoomId}`
        let [FixedSched] = await connection.query(FixedStatement);
        let [BookSched] = await connection.query(BookStatement);
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
                let events = BookEvents(formattedDate, Sched.StartTime, Sched.EndTime, Sched.BookingId);
                FullSched.push(...events);
            });
        }
        RoomInfo.FullSchedule = FullSched
    }
    return RoomInfos;
}

function BookEvents(SchedDate, StartTime, Endtime, BookingId) {
    let events = []
    let DateStr = new Date(SchedDate).toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' });



    events.push({
        title: "Occupied",
        start: `${DateStr}T${StartTime}`,
        end: `${DateStr}T${Endtime}`,
        nonDeletable: true,
        className: "OccupiedEvents",
        id: BookingId
    });


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
                title: "Occupied",
                start: `${dateStr}T${StartTime}`,
                end: `${dateStr}T${EndTime}`,
                nonDeletable: true,
                className: "OccupiedEvents"

            });
        }
        currentDate.setDate(currentDate.getDate() + 1);

    }

    return events;
}


module.exports = router