
var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
    const created = req.query.Created;
    const message = req.query.Message;
    
    res.render('AdCreateSched', { created, message });
    
});

module.exports = router;
