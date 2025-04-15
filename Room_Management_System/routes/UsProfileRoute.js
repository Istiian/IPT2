
var express = require("express");
var router = express.Router();
const User = require("../models/User");
const checkAccess = require("../middleware/Authenticate");
const BookingReport = require("../models/BookingReport");

router.get("/",checkAccess, async function(req, res) {

   const created = req.query.Created;
   const message = req.query.Message;
   const UserId = req.session.UserId;
   const Username = req.session.Username;
   const ChangePass = req.query.ChangePass
   if(UserId){
      const data = await new User().GetInfo(UserId)
      let PendingDue = await new BookingReport().getUserDueReport(UserId)
      res.render('UsProfile', { created, message,Username,data,PendingDue,ChangePass });
      
   }else{
      res.redirect('/UsLoginRoute');
   }
  

});

module.exports = router;
