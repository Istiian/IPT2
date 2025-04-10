
var express = require("express");
var router = express.Router();
const User = require("../models/User");

router.get("/", async function(req, res) {

   const created = req.query.Created;
   const message = req.query.Message;
   const UserId = req.session.UserId;
   const Username = req.session.Username;

   if(UserId){
      const data = await new User().GetInfo(UserId)
      console.log(data)
      res.render('UsProfile', { created, message,Username,data });
      
   }else{
      res.redirect('/UsLoginRoute');
   }
  

});

module.exports = router;
