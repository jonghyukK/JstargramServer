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
                resCode : "444",
                resMsg  : "already exist Email",
                isValidate : "N"
            }
            res.json(obj);
        } else {
            const obj = {
                resCode : "200",
                resMsg  : "validate email",
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
 *  유저 정보 Select ( by Email )
 * 
 ***************************************************************************/
router.get('/getUser/:email', function(req, res, next) {
    let reqEmail = req.params.email;

    models.user.findOne({
        where: {email: reqEmail}
    })
    .then( result => {
        if ( result != null){
            const obj = {
                resCode : "200",
                resMsg  : "Success Query",
                email : result.email,
                name  : result.name,
                introduce : result.introduce,
                profile_img : result.profile_img,
                contents_cnt : result.contents_cnt,
                follower_cnt : result.follower_cnt,
                following_cnt : result.following_cnt
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
 *  유저 정보 업데이트 API.
 * 
 ***************************************************************************/
router.put('/updateUser/:email', function(req, res, next){
    try {
        let reqEmail = req.params.email;
        let body = req.body;
        let params = {
            name: body.name,
            introduce: body.introduce,
            profile_img: body.profile_img
        };

        models.user.update(params, {
            where: {email: reqEmail}
        })
        .then( result => { 
            if(result == 1) {
                models.user.findByPk(reqEmail)
                    .then(user => {
                        console.log(user.dataValues);
                        res.json(user.dataValues);
                    });
            }
        })
        .catch( err => {
            console.log("User Update Failed");
        });
    } catch(e) {
        console.log(e);
    }
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
                resMsg  : "Failed SignUp"
            }
            res.json(obj)
        }
    })
    .catch( err => {
        console.log(err)
        const obj = {
            resCode : "444",
            resMsg  : "Email validation Error"
        }
        res.json(obj);
    });
});



/****************************************************************************
 * 
 *  로그인 API.
 * 
 ***************************************************************************/
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
                resMsg  : "Success Login"
            }
            res.json(obj);
        } else {
            console.log("비밀번호 불일치");
            const obj = {
                resCode : "444",
                resMsg  : "Failed Login"
            }
            res.json(obj);
        }
    })
    .catch( err => {
        console.log(err);
        const obj = {
            resCode : "444",
            resMsg  : "UnRegisted Email."
        }
        res.json(obj);
    });
});




module.exports = router;