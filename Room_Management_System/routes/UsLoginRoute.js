const express = require("express");
const router = express.Router()

router.get("/", function(req,res){
    const error = req.query.Error;
    res.render("UsLogin", {error});
});

module.exports = router;