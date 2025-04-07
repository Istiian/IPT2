const express = require("express");
const router = express.Router()

router.get("/", function(req,res){
    const UserId = req.session.UserId;
    const Username = req.session.Username;
    
    if(UserId){
        console.log(UserId)
        res.render("UsSchedule", {UserId,Username});
    }else{
        res.redirect("/UsLoginRoute?Error=Please login first");
    }
    
});

module.exports = router