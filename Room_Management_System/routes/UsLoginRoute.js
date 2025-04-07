const express = require("express");
const router = express.Router()

router.get("/", function(req,res){
    const error = req.query.Error;
    const UserId = req.session.UserId;
    
    res.render("UsLogin", {error, UserId});
    
});

module.exports = router;