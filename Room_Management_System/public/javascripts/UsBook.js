const FloorList = document.getElementById("FloorList");
const FirstFloor = document.getElementById("Floor1");
const SecondFloor = document.getElementById("Floor2");
const FloorInfo = document.getElementById("FloorInfo");
const FloorInfoXbtn = document.getElementById("FloorInfoXbtn");
const BookFormOuter = document.getElementById("BookFormOuter");
const BookForm = document.getElementById("BookForm");
const BookBtn = document.getElementById("BookBtn");
const XBookForm = document.getElementById("XBookForm");
const FloorName = document.getElementById("FloorName");
const RoomFeatures = document.getElementById("RoomFeatures")

const RoomInput = document.getElementById("RoomName")
const DateInput = document.getElementById("Date");
const StartTime = document.getElementById("StartTime");
const EndTime = document.getElementById("EndTime");
const Select = document.getElementById("Select");
const DateTimeInput = document.getElementById("DateTimeInput");
const RoomIdInput = document.getElementById("RoomId")
const CalendarContainer = document.getElementById("calendarContainer");
const xCalendar = document.getElementById("XCalendar");

let userAddedEvent = false;
let calendar;
console.log("externaljs: ", roominfo); 


BookBtn.addEventListener("click", () => BookFormOuter.classList.remove("Inactive"));
XBookForm.addEventListener("click", () => BookFormOuter.classList.add("Inactive"));
FloorInfoXbtn.addEventListener("click", () => FloorInfo.classList.add("Inactive"));
FloorList.addEventListener("change", () => {
    if (FloorList.value === "1st Floor") {
        FirstFloor.classList.add("Active");
        FirstFloor.classList.remove("Inactive");
        SecondFloor.classList.add("Inactive");
        SecondFloor.classList.remove("Active");
    } else if (FloorList.value === "2nd Floor") {
        FirstFloor.classList.remove("Active");
        FirstFloor.classList.add("Inactive");
        SecondFloor.classList.remove("Inactive");
        SecondFloor.classList.add("Active");
    }
});
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
    return calendar.getEvents().every(event =>
        (event.id === eventId || start >= event.end || end <= event.start));
}

// FixFeature(msg){
//     let newMsg;
//     msg.split("").forEach(char => {

//         if(char == ","){
//             newMsg+=" "
//         }else{
//             newMsg+=char
//         }
//      });

//     return newMsg;
// }

// Map Class
class Map {
    constructor(MapName) {
        this.MapName = MapName;
        this.map = this.createMap();
    }

    createMap() {
        const map = L.map(this.MapName, {
            crs: L.CRS.Simple,
            zoom: 15,
            maxZoom: 15,
            minZoom: 13,
            maxBounds: [[51.48, -0.13], [51.52, -0.03]],
            attributionControl: false
        });

        L.DomUtil.addClass(map.getContainer(), 'custom-map-background');
        const bounds = [[51.48, -0.12], [51.52, -0.04]];
        map.fitBounds(bounds);

        return map;
    }
}

// Reservable Room Class
class ReservableRoom {
    constructor(Coordinates, Name, RoomId, Features, Floor, Color = "#012362") {
        this.Coordinates = Coordinates;
        this.Name = Name;
        this.Floor = Floor;
        this.Color = Color;
        this.RoomId = RoomId;
        this.Features = Features;
        this.addMapLocation();
    }

    addMapLocation() {
        const room = L.polygon(this.Coordinates, {
            color: "black",
            opacity: 1,
            fillOpacity: 1,
            fillColor: this.Color
        }).addTo(this.Floor);

        // room.bindPopup(this.Name);
        room.bindTooltip(this.Name, {
            permanent: true,
            direction: "center",
            className: "room-tooltip"
        }).openTooltip();

        this.hoverEffect(room);
        this.clickHandler(room, this.Name, this.RoomId, this.FixFeature(this.Features));
    }

    hoverEffect(room) {
        room.on('mouseover', function () {
            this.setStyle({ fillOpacity: 0.9 });
        });
        room.on('mouseout', function () {
            this.setStyle({ fillOpacity: 1 });
        });
    }

    clickHandler(room, Name, RoomId, Features) {
        room.on("click", function () {
            FloorInfo.classList.remove("Inactive");
            FloorName.innerHTML = Name;
            RoomInput.value = Name;
            RoomIdInput.value = RoomId
            RoomFeatures.innerHTML = Features;
        });
    }

    FixFeature(msg) {
        let newMsg ="";
        msg.split("").forEach(char => {

            if (char == ",") {
                newMsg += ", "
            } else {
                newMsg += char
            }
        });
        console.log(newMsg)
        return newMsg;
        
    }
}

// Non-Reservable Room Class
class NonReservableRoom {
    constructor(Coordinates, Name, Floor, Color) {
        this.Coordinates = Coordinates;
        this.Name = Name;
        this.Floor = Floor;
        this.Color = Color;
        this.addMapLocation();
    }

    addMapLocation() {
        L.polygon(this.Coordinates, {
            color: "black",
            opacity: 1,
            fillOpacity: 1,
            fillColor: this.Color
        }).addTo(this.Floor).bindPopup(this.Name);
    }
}

// Faculty Office Class (Extends NonReservableRoom)
class FacultyOffice extends NonReservableRoom {
    constructor(Coordinates, Name, Floor) {
        super(Coordinates, Name, Floor, "#5b5b5b");
    }
}

// Stairs Class (Extends NonReservableRoom)
class Stairs extends NonReservableRoom {
    constructor(Coordinates, Name, Floor) {
        super(Coordinates, Name, Floor, "#fafafa");
    }

    addMapLocation() {
        L.polygon(this.Coordinates, {
            color: this.Color,
            opacity: 1,
            fillOpacity: 1,
            fillColor: this.Color
        }).addTo(this.Floor).bindPopup(this.Name);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    calendar = new FullCalendar.Calendar(document.getElementById("calendar"), {
        initialView: window.innerWidth < 768 ? "timeGridDay" : "timeGridWeek", // Mobile-friendly view
        selectable: true,
        slotMinTime: "7:00:00",
        slotMaxTime: "20:30:00",
        allDaySlot: false,
        initialDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10), // today's date
        validRange: {
            start: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10), // today's date
            end: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10) // 7 days from today
        },
        headerToolbar: {
            left: 'prev,next',
            center: '',
            right: window.innerWidth < 768 ? "" : "timeGridWeek,timeGridDay"
        },
        events: [
            {
                title: 'Existing Event',
                start: '2025-03-13T10:00:00',
                end: '2025-03-13T12:00:00',
                className: "FixedSchedule"
            }
        ],
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
                if (isTimeAvailable(calendar, info.start, info.end)) {
                    calendar.addEvent({
                        id: String(Date.now()),
                        title: 'New Event',
                        start: info.startStr,
                        end: info.endStr,
                        editable: true, // Event can be dragged
                        durationEditable: true
                    });
                    userAddedEvent = true;

                    const startFormatted = info.startStr.slice(11, 19); // Removes seconds and timezone
                    const endFormatted = info.endStr.slice(11, 19); // Removes seconds and timezone
                    const DateFormatted = info.endStr.slice(0, 10);

                    console.log("formatted sTART : ", startFormatted);
                    console.log("formatted eND: ", endFormatted);
                    console.log("formatted Date: ", DateFormatted);
                    console.log("raw: ", info.startStr);
                    DateInput.value = DateFormatted;
                    StartTime.value = startFormatted;
                    EndTime.value = endFormatted;
                } else {
                    alert('Selected time is already occupied.');
                }
            } else {
                alert('You can only add one event.');
            }
        },
        eventDrop: function (info) {
            if (isTimeAvailable(calendar, info.event.start, info.event.end, info.event.id)) {
                // Update input values
                DateInput.value = info.event.startStr.slice(0, 10);
                StartTime.value = info.event.startStr.slice(11, 19);
                EndTime.value = info.event.endStr.slice(11, 19);
            } else {
                alert('Selected time is already occupied.');
                info.revert();
            }
        },
        eventResize: function (info) {
            if (isTimeAvailable(calendar, info.event.start, info.event.end, info.event.id)) {
                // Update input values
                DateInput.value = info.event.startStr.slice(0, 10);
                StartTime.value = info.event.startStr.slice(11, 19);
                EndTime.value = info.event.endStr.slice(11, 19);
            } else {


                info.revert();
            }
        }
    });
    calendar.render();
});

// [Top-left, Top-right, Bottom-right, Bottom-left]
const Floor1 = new Map("Floor1")
const Floor2 = new Map("Floor2");


roominfo.forEach(room => {
    console.log(room.RoomId)
    if (room.RoomId <= 5) {
        new ReservableRoom(room.Coordinates, room.Room_Name, room.RoomId, room.Features, Floor1.map)

    } else if (room.RoomId <= 12) {
        new ReservableRoom(room.Coordinates, room.Room_Name, room.RoomId, room.Features, Floor2.map)
        
    }


});


const Floor1Locations = [
    new FacultyOffice([[51.5192, -0.1185], [51.5192, -0.10745], [51.5054, -0.10745], [51.5054, -0.1185]], "OFFICE", Floor1.map),

    new FacultyOffice([[51.5192, -0.049], [51.5192, -0.04159], [51.5054, -0.04159], [51.5054, -0.049]], "Girls Bathroom", Floor1.map),

    new FacultyOffice([[51.4946, -0.1185], [51.4946, -0.10745], [51.4808, -0.10745], [51.4808, -0.1185]], "Alumni", Floor1.map),
    new FacultyOffice([[51.4946, -0.06675], [51.4946, -0.058125], [51.4808, -0.058125], [51.4808, -0.06675]], "OFFICE", Floor1.map),
    new FacultyOffice([[51.4946, -0.058125], [51.4946, -0.0495], [51.4808, -0.0495], [51.4808, -0.058125]], "Clinic", Floor1.map),
    new FacultyOffice([[51.4946, -0.058125], [51.4946, -0.0495], [51.4808, -0.0495], [51.4808, -0.058125]], "Clinic", Floor1.map),
    new FacultyOffice([[51.4946, -0.0495], [51.4946, -0.04159], [51.4808, -0.04159], [51.4808, -0.0495]], "Boy Bathroom", Floor1.map),
    L.polyline([[51.5192, -0.10734], [51.5192, -0.10125]], { color: 'black' }).addTo(Floor1.map),
    L.polyline([[51.5192, -0.05442], [51.5192, -0.049]], { color: 'black' }).addTo(Floor1.map),
    L.polyline([[51.5054, -0.1185], [51.4946, -0.1185]], { color: 'black' }).addTo(Floor1.map),
]




const Floor2Locations = [
    new FacultyOffice([[51.5191, -0.1185], [51.5191, -0.1067], [51.5054, -0.1067], [51.5054, -0.1185]], "USC Office", Floor2.map),
    new FacultyOffice([[51.5191, -0.0493], [51.5191, -0.0415], [51.5054, -0.0415], [51.5054, -0.0493]], "Girls Bathroom", Floor2.map),
    new FacultyOffice([[51.4946, -0.0499], [51.4946, -0.0415], [51.4808, -0.0415], [51.4808, -0.0499]], "Boys Bathroom", Floor2.map),
    new FacultyOffice([[51.4946, -0.0584], [51.4946, -0.0499], [51.4808, -0.0499], [51.4808, -0.0584]], "CCS Office", Floor2.map),
    L.polyline([[51.5191, -0.1067], [51.5191, -0.10130]], { color: 'black' }).addTo(Floor2.map),
    L.polyline([[51.5191, -0.0548], [51.5191, -0.0493]], { color: 'black' }).addTo(Floor2.map),
    L.polyline([[51.5054, -0.1185], [51.4946, -0.1185]], { color: 'black' }).addTo(Floor2.map),
]

