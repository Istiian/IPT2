var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
    res.render("SignUp");
});

module.exports = router;
