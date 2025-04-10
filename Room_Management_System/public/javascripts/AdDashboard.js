
const Pie = document.getElementById('Pie');
const DueReporChart = document.getElementById('DueReporChart');
const RoomChart = document.getElementById('RoomChart');

const Piedata = {
    labels: ['Accepted', 'Rejected'],
    datasets: [
        {
            label: "Quantity",
            data: [Quantity.Accepted, Quantity.Rejected],
            backgroundColor: [
                'rgba(0, 166, 118, 0.5)',
                'rgba(255, 75, 75, 0.5)'
            ],
            borderColor: [
                'rgba(0, 166, 118, 1)',
                'rgba(255, 75, 75, 1)'
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
                position: 'top',
                labels: {
                    color: '#0d0d0d',
                    
                }
            },
            title: {
                display: true,
                text: 'Summary of Bookings in the last 7 days',
                color: '#0d0d0d' // This sets the title color
                
            }
        }
    }
});


const DueReportsPerRoom = Quantity.DueReportsPerRoom.map((room) => {
    return room.total_quantity;
});

const DueChart = new Chart(DueReporChart, {
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
            // {
            //     label: 'Accepted Reservations',
            //     data: AcceptedBookingPerRoom,
            //     backgroundColor: 'rgba(0, 166, 118, 0.5)',
            //     borderColor: 'rgba(70, 166, 118, 1)',
            //     borderWidth: 1,
                
                
            // },
            // {
            //     label: 'Pending Reservations',
            //     data: PendingBookingPerRoom,
            //     backgroundColor: 'rgba(255, 200, 87, 0.5)',
            //     borderColor: 'rgba(255, 200, 87, 1)',
            //     borderWidth: 1
            // },
            {
                label: 'Due Reservation Reports',
                data: DueReportsPerRoom,
                backgroundColor: 'rgba(255, 75, 75, 0.5)',
                borderColor: 'rgba(255, 75, 75, 1)',
                borderWidth: 1
            }
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#0d0d0d',
                    
                },
                grid: {
                    color: '#0d0d0d'
                }
            },
            x:{
                ticks:{
                    color:'#0d0d0d',
                },
                grid: {
                    color: '#0d0d0d'
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: '#0d0d0d',
                    
                }
            },
            title: {
                display: true,
                text: 'Summary of Due Reservation Reports per Room',
                color: '#0d0d0d',
            }
        },
    },

});

const AcceptedBookingPerRoom = Quantity.BookingPerRoom.map((room) => {
    return room.total_quantity;
});

// const PendingBookingPerRoom = Quantity.PendingBookingPerRoom.map((room) => {
//     return room.total_quantity;
// });

const myBarChart = new Chart(RoomChart, {
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
                label: 'Reservations',
                data: AcceptedBookingPerRoom,
                backgroundColor: 'rgba(0, 166, 118, 0.5)',
                borderColor: 'rgba(70, 166, 118, 1)',
                borderWidth: 1,
            }
            
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#0d0d0d',
                    
                },
                grid: {
                    color: '#0d0d0d'
                }
            },
            x:{
                ticks:{
                    color:'#0d0d0d',
                },
                grid: {
                    color: '#0d0d0d'
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: '#0d0d0d',
                    
                }
            },
            title: {
                display: true,
                text: 'Summary of Reservation per Room',
                color: '#0d0d0d',
            }
        },
    },
});