var express = require("express");
var router = express.Router();

router.get("/", function(req, res){
    const role = req.session.role;

    if(role =="admin"){
        req.session.destroy()
        res.redirect("/AdLoginRoute")
    }else if (role=="user"){
        req.session.destroy()
        res.redirect("/UsLoginRoute")
    }

});

module.exports = router