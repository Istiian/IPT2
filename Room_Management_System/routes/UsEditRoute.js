
const express = require("express");
const router = express.Router()

router.get("/", function(req,res){
    const error = req.query.Error;
    const UserId = req.session.UserId;
    const Username = req.session.Username

    
    res.render("UsEdit", {error, UserId, Username});
    
});

module.exports = router;