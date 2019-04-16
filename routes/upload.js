var express = require('express');
var models = require('../models');
var fs = require('fs');
var router = express.Router();

var multer = require("multer");

let storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, "upload/")
    },
    filename: function(req, file, callback){
        callback(null, file.originalname + "-" + Date.now())
    }
});

let upload = multer({
    storage: storage
})


/******************************************************************************
 * 
 *   Image File Upload API.
 * 
 *****************************************************************************/
router.post('/create/:writer', upload.single("image"), function(req, res, next){
    console.log("post")
    console.log(req.file)
    console.log(req.file.path)
    console.log(upload)
    console.log(upload.storage.getFilename)

    let file = req.file;
    let writer = req.params.writer;

    console.log(writer);

    try {
    models.upload_images.create({
        file_path: req.file.path,
        size : req.file.size,
        writer: writer
    })
    .then(result => {
        let obj = {
            message : "Success Upload Images",
            path : file.path
        }
        console.log(obj);
        res.json(obj);

        models.upload_images.findOne({
            where: {writer: "saz300@naver.com"}
        })
        .then(result => {
            fs.readFile(result.file_path, function(error, data){
                console.log(data);
            
            })
        })
    })
    .catch( err => {
        console.log(err);
        let obj = {
            message: "Failed Upload Images",
            path : "null"
        }
        res.json(obj);
    })
} catch (e){
    console.log(e);
}
});



router.get("/getFile", function(req, res){
    var path = __dirname + '/upload/'

    models.upload_images.findOne({
        where: {writer: "saz300@naver.com"}
    })
    .then(result => {
        
        console.log(result.file_path);
        fs.readFile(path, function(error, data){
            console.log(data)
            res.send('Success"')
        })
    })
})


router.post('/create2', upload.single("image"), function(req, res){

    try {
        console.log(req.file)
        console.log(req.body.desc)
        console.log(__dirname + '..')

        models.upload_images.create({
            size : req.file.size,
            writer: req.body.desc,
            file_path: fs.readFileSync('/Users/mac/JstargramServer/upload/' + req.file.filename)
        }).then ( images => {
            try {
                fs.writeFileSync('/Users/mac/JstargramServer/tmp/' + images.filename, images.data)

                console.log("##############################")
            
                console.log(images.filename)
                console.log(images.data)
            } catch (e){
                console.log(e)
                // res.json({'err': e});
            }
        })
    } catch (e) {
        console.log(e)
    }
 

    
})





module.exports = router;