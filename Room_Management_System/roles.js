const roles = {
    admin: [
        '/AdCreateAccountRoute', 
        '/AdDashboardRoute', 
        '/AdManageBookingRoute', 
        '/AdManageRoomRoute',
        '/AdminRoute',
        '/AdTrackRoute'
    ],
    
    user: [
        '/UsBookRoute', // Ensure this route is included
        '/UsEditRoute',
        '/UserRoute',
        '/UsProfileRoute',
        '/UsReportFormRoute',
        '/UsReportSubmissionRoute',
        '/UsScheduleRoute'
    ]    
};

module.exports = roles;