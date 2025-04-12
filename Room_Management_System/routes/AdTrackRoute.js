
var express = require("express");
const checkAccess = require("../middleware/Authenticate");
var router = express.Router();

router.get("/",checkAccess, function(req, res) {
    let UserId = req.session.UserId;
    let Username = req.session.Username;

    if (UserId) {
        res.render('AdTrack', {Username});
    }else{
        res.redirect("/AdLoginRoute")
    }
});

module.exports = router;
