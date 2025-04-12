
var express = require("express");
var router = express.Router();
const User = require("../models/User");
const checkAccess = require("../middleware/Authenticate");


router.get("/",checkAccess, async function(req, res) {

   const created = req.query.Created;
   const message = req.query.Message;
   const UserId = req.session.UserId;
   const Username = req.session.Username;

   if(UserId){
      const data = await new User().GetInfo(UserId)

      res.render('UsProfile', { created, message,Username,data });
      
   }else{
      res.redirect('/UsLoginRoute');
   }
  

});

module.exports = router;
