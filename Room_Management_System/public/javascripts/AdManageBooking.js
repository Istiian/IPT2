// console.log(BookingDatas)

// let bookings = [
//     { BookingId: 5, UserId: 1, RoomId: 3, StartTime: '08:00:00', EndTime: '09:00:00' },
//     { BookingId: 6, UserId: 1, RoomId: 4, StartTime: '07:00:00', EndTime: '07:30:00' }, // No conflict
//     { BookingId: 7, UserId: 2, RoomId: 3, StartTime: '08:30:00', EndTime: '09:30:00' }  // Conflicts with BookingId 5
// ];

// function findConflict(bookings){

//     let Sorted = BookingDatas.map(Data, ()=>{

//     })
// }
const AcceptBtns = document.querySelectorAll(".AcceptBtn");
const RowDatas = document.querySelectorAll(".RowData");
const conflictInputs = document.querySelectorAll(".conflictInput");
let isConflict;


AcceptBtns.forEach((Btn, index) => {
    Btn.addEventListener("mouseover", () => {
        findConflict(BookingDatas, index, "Add")

    });

    Btn.addEventListener("mouseout", () => {
        findConflict(BookingDatas, index, "Remove")
    });
});
const forms = document.querySelectorAll("form");

forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
        let clickedButton = document.activeElement;

        if (clickedButton && clickedButton.value === "0") {
            let userConfirmed = confirm("Are you sure you want to reject this request?");

            if (userConfirmed) {
                form.noValidate = true;
                form.requestSubmit();
            } else {

                event.preventDefault();
            }
        } else {

            if (isConflict) {
                let userConfirmed = confirm("There is an existing conflict. Are you sure you want to accept this request? The other request will be rejected automatically.")
                if (userConfirmed) {
                    form.noValidate = true;
                    form.requestSubmit();
                } else {
                    event.preventDefault();
                }
            }else{
                let userConfirmed = confirm("Are you sure you want to accept this request?")
                if (userConfirmed) {
                    form.noValidate = true;
                    form.requestSubmit();
                } else {
                    event.preventDefault();
                }
            }

        }
    });
});

function findConflict(bookings, BtnIndex, Action) {
    let Formattedbooking = bookings.map((data, index) => ({
        startTime: new Date(`${data.FormattedNumericalDate}T${data.StartTime}`),
        endTime: new Date(`${data.FormattedNumericalDate}T${data.EndTime}`),
        BookingId: data.BookingId,
        RoomId: data.RoomId,
        RoomIndex: index
    }));

    // sortedBookings.sort((a, b) => a.startTime - b.startTime);
    let conflictArray = [];
    let conflictIndex = []
    let data1 = Formattedbooking[BtnIndex]

    for (let i = 0; i < Formattedbooking.length; i++) {

        let data2 = Formattedbooking[i]

        if (i == BtnIndex) {
            continue
        } else {
            if (data1.RoomId === data2.RoomId) {
                if (data1.endTime > data2.startTime && data1.startTime < data2.endTime) {
                    conflictIndex.push(data2.RoomIndex)
                    conflictArray.push(data2.BookingId)

                }
            }
        }
    }

    conflictIndex.forEach((index) => {
        if (Action == "Add") {
            RowDatas[index].classList.add("Conflict");
            isConflict = false
        } else {
            RowDatas[index].classList.remove("Conflict")
            isConflict = true
        }
    })


    conflictInputs[BtnIndex].value = JSON.stringify(conflictArray)


}




