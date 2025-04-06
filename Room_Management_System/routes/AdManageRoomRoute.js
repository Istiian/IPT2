
var express = require("express");
var router = express.Router();
var Book = require("../models/Book");
const moment = require('moment');


router.get("/", async function(req, res) {

    const PendingBookingPerRoom = await new Book().GetQuantityOfPendingBookingPerRoom()
    const BookingPerRoom = await new Book().GetQuantityAcceptedBookingsPerRoom()
    const DueReportsPerRoom = await new Book().GetQuantityDueReportsPerRoom()

    const Summary = PendingBookingPerRoom.map((room, index) => ({
        RoomId: room.RoomId,
        RoomName: DueReportsPerRoom[index]?.Room_Name || "Unknown Room Name",
        DueReport: DueReportsPerRoom[index]?.total_quantity || 0,
        Accepted: BookingPerRoom[index]?.total_quantity || 0,
        Pending: room.total_quantity || 0,
    }));
    console.log(Summary)

    res.render('AdManageRoom', {Summary});
    
});

router.get("/Reservation/:id", async function(req, res) {
    const roomId = req.params.id;
    const BookingDatas = await new Book().GetPendingBookings(roomId);
    
    BookingDatas.forEach(Data => {
        Data.FormattedDate = moment(Data.BookingDate).format("MMMM Do YYYY");
        Data.FormattedStartTime = moment(Data.StartTime, "HH:mm").format("hh:mm A");
        Data.FormattedEndTime = moment(Data.EndTime, "HH:mm").format("hh:mm A");
        Data.FormattedNumericalDate = moment(Data.BookingDate).format("YYYY-MM-DD");
    });

    res.render("AdManageRequest", {BookingDatas:BookingDatas });
})

router.get("/DueReport/:id", async function(req, res) {
    const roomId = req.params.id;
    const BookingDatas = await new Book().GetDueReportsDetails(roomId);
    
    BookingDatas.forEach(Data => {
        Data.FormattedDate = moment(Data.BookingDate).format("MMMM Do YYYY");
        Data.FormattedStartTime = moment(Data.StartTime, "HH:mm").format("hh:mm A");
        Data.FormattedEndTime = moment(Data.EndTime, "HH:mm").format("hh:mm A");
        Data.FormattedNumericalDate = moment(Data.BookingDate).format("YYYY-MM-DD");
    });

    res.render("AdManageDueReport", {BookingDatas:BookingDatas });
    // res.send(BookingDatas);
})


module.exports = router;
