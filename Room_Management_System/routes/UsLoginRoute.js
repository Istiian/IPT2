const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult, matchedData  } = require('express-validator');
const checkAccess = require("../middleware/Authenticate");


router.get("/", function(req,res){
    const error = req.query.Error;
    const UserId = req.session.UserId;
    
    res.render("UsLogin", {error, UserId});
    
});

router.post("/Login", [
    body("Username").trim().escape(),
    body("Password").trim().escape(),
], async (req, res) => {
    const Inputed = {
        username: req.body.Username,
        password: req.body.Password
    }

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        // Return errors if validation fails
        return res.status(400).json({ errors: errors.array() });
    }

    let SqlStatement = `SELECT Username, Password, UserId FROM user WHERE username = ?`
    const [result] = await connection.query(SqlStatement, [Inputed.username])
    try {
        if (result.length > 0) {
            const user = new User(result[0].Username,
                result[0].Password,
            )
            if (await user.VerifyPassword(Inputed.password)) {
                req.session.UserId = result[0].UserId;
                req.session.Username = result[0].Username;
                req.session.role = "user" // Set the role in the session
                
                res.redirect("/UsBookRoute")
            } else {
                res.redirect('/UsLoginRoute?Error=true')
            }
        } else {

            res.redirect('/UsLoginRoute?Error=true')
        }
    } catch (error) {
        console.error(error.message);
    }
});

module.exports = router;