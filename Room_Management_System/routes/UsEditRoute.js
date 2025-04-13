
const express = require("express");
const checkAccess = require("../middleware/Authenticate");
const router = express.Router()

router.get("/", checkAccess, function(req,res){
    const error = req.query.Error;
    const UserId = req.session.UserId;
    const Username = req.session.Username

    if(UserId){
        res.render("UsEdit", {error, UserId, Username});
    }else{
        res.redirect("UsLoginRoute")
    }
    
});

module.exports = router;