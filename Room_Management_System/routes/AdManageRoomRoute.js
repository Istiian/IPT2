
var express = require("express");
var router = express.Router();
var Book = require("../models/Book");
const moment = require('moment');
const checkAccess = require("../middleware/Authenticate");


router.get("/", checkAccess, async function (req, res) {

    let UserId = req.session.UserId;
    let Username = req.session.Username;

    if (UserId) {
        const BookingPerRoom = await new Book().GetQuantityBookingsPerRoom()
        const DueReportsPerRoom = await new Book().GetQuantityDueReportsPerRoom()
        const HistoryPerRoom = await new Book().getHistoryBookingQuantity()

        
        const Summary = BookingPerRoom.map((room, index) => ({
            RoomId: room.RoomId,
            RoomName: DueReportsPerRoom[index]?.Room_Name || "Unknown Room Name",
            DueReport: DueReportsPerRoom[index]?.total_quantity || 0,
            Accepted: room.total_quantity || 0,
            History: HistoryPerRoom[index].total_quantity
        }));

        console.log("BookingPerRoom",BookingPerRoom)
        console.log("DueReportsPerRoom",DueReportsPerRoom )
        console.log("HistoryPerRoom",HistoryPerRoom )


        res.render('AdManageRoom', { Summary, Username });
    } else {
        res.redirect("/AdLoginRoute")
    }

});

router.get("/Reservation/:id",checkAccess, async function (req, res) {

    let UserId = req.session.UserId;
    let Username = req.session.Username;
    if (UserId) {
        const BookingDatas = await new Book().GetPendingBookings(roomId);
        const roomId = req.params.id;
        BookingDatas.forEach(Data => {
            Data.FormattedDate = moment(Data.BookingDate).format("MMMM Do YYYY");
            Data.FormattedStartTime = moment(Data.StartTime, "HH:mm").format("hh:mm A");
            Data.FormattedEndTime = moment(Data.EndTime, "HH:mm").format("hh:mm A");
            Data.FormattedNumericalDate = moment(Data.BookingDate).format("YYYY-MM-DD");
        });
        res.render("AdManageRequest", { BookingDatas: BookingDatas, Username });
    } else {
        res.redirect("/AdLoginRoute")
    }



})

router.get("/DueReport/:id",checkAccess, async function (req, res) {
    let UserId = req.session.UserId;
    let Username = req.session.Username;

    if (UserId) {
        const roomId = req.params.id;
        const BookingDatas = await new Book().GetDueReportsDetails(roomId);
        BookingDatas.forEach(Data => {
            Data.FormattedDate = moment(Data.BookingDate).format("MMMM Do YYYY");
            Data.FormattedStartTime = moment(Data.StartTime, "HH:mm").format("hh:mm A");
            Data.FormattedEndTime = moment(Data.EndTime, "HH:mm").format("hh:mm A");
            Data.FormattedNumericalDate = moment(Data.BookingDate).format("YYYY-MM-DD");
        });
        res.render("AdManageDueReport", { BookingDatas: BookingDatas,Username });
    }else{
        res.redirect("/AdLoginRoute")
    }
})

router.get("/Active/:id",checkAccess, async function (req, res) {
    let UserId = req.session.UserId;
    let Username = req.session.Username;

    if (UserId) {
        const RoomId = req.params.id;
        const BookingDatas = await new Book().GetActiveReservation(RoomId);
        BookingDatas.forEach(Data => {
            Data.FormattedDate = moment(Data.BookingDate).format("MMMM Do YYYY");
            Data.FormattedStartTime = moment(Data.StartTime, "HH:mm").format("hh:mm A");
            Data.FormattedEndTime = moment(Data.EndTime, "HH:mm").format("hh:mm A");
            Data.FormattedNumericalDate = moment(Data.BookingDate).format("YYYY-MM-DD");
        });
        res.render("AdManageActive", { BookingDatas: BookingDatas, Username });
    }else{
        res.redirect("/AdLoginRoute")
    }
})

router.get("/History/:id",checkAccess, async function (req, res) {
    let UserId = req.session.UserId;
    let Username = req.session.Username;

    if (UserId) {
        const RoomId = req.params.id;
        const BookingDatas = await new Book().getHistoryBooking(RoomId);

        BookingDatas.forEach(Data => {
            Data.FormattedDate = moment(Data.BookingDate).format("MMMM Do YYYY");
            Data.FormattedStartTime = moment(Data.StartTime, "HH:mm").format("hh:mm A");
            Data.FormattedEndTime = moment(Data.EndTime, "HH:mm").format("hh:mm A");
            Data.FormattedNumericalDate = moment(Data.BookingDate).format("YYYY-MM-DD");
        });
        res.render("AdManageHistory", { BookingDatas: BookingDatas, Username });
    }else{
        res.redirect("/AdLoginRoute")
    }
});

router.get("/History/FullDetails/:id",checkAccess, async function (req, res) {
    let UserId = req.session.UserId;
    let Username = req.session.Username;

    if (UserId) {
        const BookingId = req.params.id;
        const BookingDatas = await new Book().getHistoryBooking(null, BookingId);
        BookingDatas.forEach(Data => {
            Data.FormattedDate = moment(Data.BookingDate).format("MMMM Do YYYY");
            Data.FormattedStartTime = moment(Data.StartTime, "HH:mm").format("hh:mm A");
            Data.FormattedEndTime = moment(Data.EndTime, "HH:mm").format("hh:mm A");
            Data.FormattedNumericalDate = moment(Data.BookingDate).format("YYYY-MM-DD");
        });

        res.render("AdManageHistoryFullDetails", { BookingDatas: BookingDatas, Username });
    }else{
            res.redirect("/AdLoginRoute")
    }
});

module.exports = router;
