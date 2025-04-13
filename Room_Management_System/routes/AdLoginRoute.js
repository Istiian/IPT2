const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin")

const { body, validationResult,matchedData  } = require('express-validator');

router.get("/", function(req,res){
    const UserId = req.session.UserId;
    const Username = req.session.Username;

    if(UserId){
        res.redirect("/AdDashboardRoute")
    }else{
        const error = req.query.Error;
        res.render("AdLogin", {error});
    }
});

router.post("/Login",
    [
        body("Username").trim().escape(),
        body("Password").trim().escape(),
    ],
    async(req,res) =>{

    const Inputed ={
        Username: req.body.Username,
        Password: req.body.Password
    }
    console.log(Inputed)
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        // Return errors if validation fails
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let SqlStatement = `SELECT AdminId, Username, Password FROM admin WHERE username = ?`
        const [result] = await connection.query(SqlStatement, [Inputed.Username])

        if (result.length > 0) {
            const admin = new Admin(result[0].Username,
                result[0].Password,
            )

            if (await admin.VerifyPassword(Inputed.Password)) {
                req.session.UserId = result[0].AdminId;
                req.session.Username = result[0].Username;
                req.session.role = "admin"
                res.redirect("/AdDashboardRoute")
            } else {
                res.redirect('/AdLoginRoute?Error=true')
            }
        } else {
            res.redirect('/AdLoginRoute?Error=true')
        }
    } catch (error) {
        console.error(error.message);
    }

    
});

module.exports = router;