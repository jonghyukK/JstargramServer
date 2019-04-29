const express = require('express');
const router = express.Router();
const models = require('../models');
const fs = require('fs');
const multer = require('multer');

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'content_images/');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname + '-' + Date.now());
    }
});

let upload = multer({
    storage: storage
});


// Upload Main Contents
router.post('/uploadContent', upload.single('image'), function (req, res) {
    try {
        let content_text = req.body.content;    // 내용
        let writer = req.body.writer;           // 글쓴이
        let imagePath = req.file.path;          // 이미지 경로
        
        models.user.findOne({ where: { email: writer }})
        .then(result => {
            let profileImg = result.dataValues.profile_img

            models.contents.create({
                image_path: imagePath,
                content: content_text,
                writer: writer,
                writer_profile: profileImg
            })
            .then(contentResult => {
                console.log(contentResult.dataValues);
                const obj = { 
                    resCode : '200',
                    resMsg : 'Success Upload for Main Contents'
                }
                res.json(obj);
            })
            .catch(err => {
                console.log(err);
                const obj = { 
                    resCode : '444',
                    resMsg : 'Failed Upload Main Contents'
                }
                res.json(obj);
            })
        })
       
    } catch (e) {
        console.log(e);
    }
});

router.get('/getContents', function(req, res){
    try{
        models.contents.findAll().then(function(result) {
            console.log("getContents : " + JSON.stringify(result));
            res.json(result);
        })
    } catch (err){
        console.log(err);
    }
})



module.exports = router;