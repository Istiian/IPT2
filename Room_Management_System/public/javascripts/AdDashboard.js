
const Pie = document.getElementById('Pie');
const Bar = document.getElementById('Bar');

const Piedata = {
    labels: ['Accepted', 'Rejected'],
    datasets: [
        {
            label: "Quantity",
            data: [Quantity.Accepted, Quantity.Rejected],
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1

        }
    ]
};

new Chart(Pie, {
    type: 'pie',
    data: Piedata,

    options: {
        responsive: true,
        maintainAspectRatio: true,
        devicePixelRatio: 1, // Ensure consistent scaling // Allow scaling independently
        width: 700,
        height: 300,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Summary of Bookings in the last 7 days'
            }
        }
    }
});


const AcceptedBookingPerRoom = Quantity.BookingPerRoom.map((room) => {
    return room.total_quantity;
});

const myBarChart = new Chart(Bar, {
    type: 'bar',
    data: {
        labels: ["CCS 101",
            "CCS 102",
            "CCS 104",
            "CCS 105",
            "CCS 106",
            "CCS 201",
            "CCS 202",
            "CCS 203",
            "CCS 204",
            "Acer Lab 1",
            "CCS Lab 1",
            "CCS Lab 2"],
        datasets: [
            {
                label: 'Accepted Bookings',
                data: AcceptedBookingPerRoom,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Pending Bookings',
                data: AcceptedBookingPerRoom,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Due Reports',
                data: AcceptedBookingPerRoom,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top'
            },
            title: {
                display: true,
                text: 'Booking per Room in the last 7 days'
            }
        },
    },

});