// const BookFormOuter = document.getElementById("BookFormOuter");
const BookForm = document.getElementById("BookForm");
// const BookBtn = document.getElementById("BookBtn");
// const XBookForm = document.getElementById("XBookForm");
const RoomInput = document.getElementById("RoomName");
const RoomIdInput = document.getElementById("RoomId");
const DateInput = document.getElementById("Date");
const StartTime = document.getElementById("StartTime");
const EndTime = document.getElementById("EndTime");
const Select = document.getElementById("Select");
const PurposeInput = document.getElementById("PurposeInput");
const DateTimeInput = document.getElementById("DateTimeInput");
const CalendarContainer = document.getElementById("calendarContainer");
const xCalendar = document.getElementById("XCalendar");

let userAddedEvent = true;
let calendar;

RoomInput.addEventListener("change", () => {
    switch (RoomInput.value) {
        case "CCS 101":
            RoomIdInput.value = 1
            break;
        case "CCS 102":
            RoomIdInput.value = 2
            break;
        case "CCS 104":
            RoomIdInput.value = 3
            break;
        case "CCS 105":
            RoomIdInput.value = 4
            break;
        case "CCS 106":
            RoomIdInput.value = 5
            break;
        case "CCS 201":
            RoomIdInput.value = 6
            break;
        case "CCS 202":
            RoomIdInput.value = 7
            break;
        case "CCS 203":
            RoomIdInput.value = 8
            break;
        case "CCS 204":
            RoomIdInput.value = 9
            break;
        case "Acer Lab 1":
            RoomIdInput.value = 10
            break;
        case "CCS Lab 2":
            RoomIdInput.value = 11
            break;
        case "CCS Lab 1":
            RoomIdInput.value = 12
            break;
    }

    DateInput.value = ""
    StartTime.value = ""
    EndTime.value = ""

    changeCalendarEvents(roominfo[RoomIdInput.value - 1].FullSchedule);
    userAddedEvent = false
})

DateTimeInput.addEventListener("click", () => {
    CalendarContainer.classList.add("Active");
    CalendarContainer.classList.remove("Inactive");
    calendar.render();
})

xCalendar.addEventListener("click", () => {
    CalendarContainer.classList.remove("Active");
    CalendarContainer.classList.add("Inactive");
    calendar.render();
})

function isTimeAvailable(calendar, start, end, eventId) {
    console.log("TIME:", start)
    return calendar.getEvents().every(event =>
        (event.id === eventId || start >= event.end || end <= event.start));
}

function isTimeValid(calendar, start, end, eventId) {
    const now = new Date();
    console.log("Start: ", start)
    console.log("now: ", now)
    return now < start
}



function changeCalendarEvents(Schedules) {
    calendar.getEvents().forEach(event => event.remove());
    Schedules.forEach(Schedule => calendar.addEvent(Schedule));
    console.log(Schedules); // enable user to create another event(their desired schedule) on calendar
    calendar.render();
}


document.addEventListener("DOMContentLoaded", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate());
    console.log(tomorrow.toLocaleDateString('en-CA'));
    calendar = new FullCalendar.Calendar(document.getElementById("calendar"), {
        initialView: window.innerWidth < 768 ? "timeGridDay" : "timeGridWeek", // adjust calendar based on user's screen size
        selectable: true,
        slotMinTime: "7:00:00",
        slotMaxTime: "20:30:00",
        allDaySlot: false,
        initialDate: new Date(new Date().setDate(new Date().getDate())).toISOString().slice(0, 10), // today's date
        validRange: {
            start: tomorrow.toLocaleDateString('en-CA'), // tommorow's date
            end: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10) // 7 days from today
        },

        headerToolbar: {
            left: 'prev,next',
            center: '',
            right: window.innerWidth < 768 ? "" : "timeGridWeek,timeGridDay" // adjust calendar based on user's screen size
        },

        windowResize: function (view) {
            let newView = window.innerWidth < 768 ? "timeGridDay" : "timeGridWeek";
            calendar.changeView(newView); // Change view dynamically
            calendar.setOption("headerToolbar", {
                left: 'prev,next',
                center: '',
                right: window.innerWidth < 768 ? "" : "timeGridWeek,timeGridDay"
            });

        },

        select: function (info) {
            if (!userAddedEvent) {
                if(isTimeValid(calendar, info.start, info.end)){
                    if (isTimeAvailable(calendar, info.start, info.end)) {
                        calendar.addEvent({
                            id: String(Date.now()),
                            title: 'Selected Time',
                            start: info.startStr,
                            end: info.endStr,
                            editable: true,
                            className: "SelectedTime"
                        });
                        DateInput.value = info.startStr.slice(0, 10);
                        StartTime.value = info.startStr.slice(11, 19);
                        EndTime.value = info.endStr.slice(11, 19);
    
                        userAddedEvent = true;
                    } else {
                        alert('Selected time is already occupied.');
                    }
                }else{
                    alert('Invalid Time');
                    info.revert()
                }
                
            } else {
                alert('You could only select time schedule at once.');
            }
        },
        eventClick: function (info) {
            
            if (!info.event.extendedProps.nonDeletable) {
                info.event.remove(); // Deletes the event
                userAddedEvent = false;
                DateInput.value = "";
                StartTime.value = "";
                EndTime.value = "";
            }
        },
        eventDrop: function (info) {
            if(isTimeValid(calendar, info.event.start, info.event.end)){
                if (isTimeAvailable(calendar, info.event.start, info.event.end, info.event.id)) {

                    DateInput.value = info.event.startStr.slice(0, 10);
                    StartTime.value = info.event.startStr.slice(11, 19);
                    EndTime.value = info.event.endStr.slice(11, 19);

                } else {
                    alert('Selected time is already occupied.');
                    info.revert();
                }
            }else{
                alert('Invalid Time');
                info.revert()
            }
        },

        eventResize: function (info) {
            if (isTimeAvailable(calendar, info.event.start, info.event.end, info.event.id)) {
                DateInput.value = info.event.startStr.slice(0, 10);
                StartTime.value = info.event.startStr.slice(11, 19);
                EndTime.value = info.event.endStr.slice(11, 19);
            } else {
                alert('Selected time is already occupied.');
                info.revert();
            }

        }
    });
    calendar.render();

    if (RoomIdInput.value && roominfo[RoomIdInput.value - 1]) {

        roominfo[RoomIdInput.value - 1].FullSchedule.forEach(Schedule => {
            if (BookingInfo.BookingId == Schedule.id) {
                console.log("Schedule:", Schedule)
                Schedule.editable = true
                Schedule.className = "SelectedTime"
                Schedule.nonDeletable = false
                userAddedEvent = true // make the schedule editable
            }
            console.log("Schedule:", Schedule)
        });
        changeCalendarEvents(roominfo[RoomIdInput.value - 1].FullSchedule);
    } else {
        console.error("Invalid Room ID on page load");
        // Optional: Load default data or show an error
    }

});

