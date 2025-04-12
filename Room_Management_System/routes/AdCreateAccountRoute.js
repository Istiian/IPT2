
var express = require("express");
const checkAccess = require("../middleware/Authenticate");
var router = express.Router();

router.get("/",checkAccess, function(req, res) {
    const created = req.query.Created;
    const message = req.query.Message;
    const UserId = req.session.UserId;
    const Username = req.session.Username;

    if(UserId){
        res.render('AdCreateAccount', { created, message, Username });
    }else{
        res.redirect("/AdLoginRoute")
    }
    
    
});

module.exports = router;
