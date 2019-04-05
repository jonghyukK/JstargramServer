const express = require('express');
const router = express.Router();
const models = require("../models");
const crypto = require("crypto");



/***************************************************************************
 * 
 *   이메일 등록시, 이메일 유효성 Check.
 * 
 ***************************************************************************/
router.get('/validateEmail/:email', function(req, res, next){
    let reqEmail = req.params.email;

    models.user.findOne({
        where: {email: reqEmail}
    })
    .then( result => {
        if ( result != null ){
            const obj = {
                isValidate : "N"
            }
            res.json(obj);
        } else {
            const obj = {
                isValidate : "Y"
            }
            res.json(obj);
        }
    })
    .catch( err => {
        console.log(err);
    });
});

/****************************************************************************
 * 
 *  유저 등록 API 
 * 
 ***************************************************************************/
router.post("/sign_up", function(req, res, next){
    let body = req.body;

    let inputPassword = body.password;
    let salt = Math.round((new Date().valueOf() * Math.random())) + "";
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

    models.user.create({
        name: body.name,
        email: body.email,
        password: hashPassword,
        salt: salt
    })
    .then( result => {
        if ( result.email != null) {
            const obj = { 
                resCode : "200",
                resMsg  : "Success SignUp"
            }
            res.json(obj)
        } else {
            const obj = { 
                resCode : "444",
                resMsg  : "Fail SignUp"
            }
            res.json(obj)
        }
    })
    .catch( err => {
        console.log(err)
        const obj = {
            resCode : "445",
            resMsg  : "Email validation Error"
        }
        res.json(obj);
    });
});




router.post("/login", function(req, res, next){
    let body = req.body;

    models.user.findOne({
        where: {email: body.email}
    })
    .then( result => {
        let dbPassword = result.dataValues.password;

        let inputPassword = body.password;
        let salt = result.dataValues.salt;
        let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

        if(dbPassword === hashPassword) {
            console.log("비밀번호 일치");
            const obj = {
                resCode : "200",
                resMsg  : "Success Login",
                body    : result
            }
            res.json(obj);
        } else {
            console.log("비밀번호 불일치");
            const obj = {
                resCode : "500",
                resMsg  : "Failed Login"
            }
            res.json(obj);
        }
    })
    .catch( err => {
        console.log(err);
        res.json(err);
    });
});




module.exports = router;