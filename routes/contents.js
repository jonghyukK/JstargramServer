const express = require('express');
const router  = express.Router();
const models  = require('../models');
const fs      = require('fs');
const multer  = require('multer');

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


// Upload Main Contents.
router.post('/uploadContent', upload.single('image'), function (req, res) {
    try {
        let content_text = req.body.content;    // 내용
        let writer       = req.body.writer;     // 글쓴이
        let imagePath    = req.file.path;       // 이미지 경로

        models.user.findOne({ where: { email: writer } })
            .then(result => {
                let profileImg   = result.dataValues.profile_img
                let contents_cnt = result.dataValues.contents_cnt

                models.contents.create({
                    image_path  : imagePath,
                    content     : content_text,
                    writer      : writer,
                    writer_profile: profileImg
                })
                .then(contentResult => {
                    
                    models.user.update({contents_cnt : contents_cnt + 1}, {
                        where: { email: writer }
                    }).then(_ => {
                        console.log("      ")
                        console.log("contents add ++")
                        console.log("      ")
                    }).catch(err => { console.log(err)});

                    console.log(contentResult.dataValues);
                    const obj = {
                          resCode: '200',
                          resMsg: 'Success Upload for Main Contents'
                      }
                       res.json(obj);
                 })
                 .catch(err => {
                       console.log(err);
                     const obj = {
                        resCode: '444',
                        resMsg: 'Failed Upload Main Contents'
                    }
                     res.json(obj);
                 })
            })
    } catch (e) {
        console.log(e);
    }
});






// Get All Contents.
router.get('/getContents', function (req, res) {
    try {
        let dataType = req.query.dataType;
        let reqEmail = req.query.email;
        let q1 = ""

        console.log("            ")
        console.log("            ")
        console.log(dataType + "       "  + reqEmail)
        console.log("            ")
        console.log("            ")

        if ( dataType == "all") {
            q1 = 'SELECT * FROM contents';
        } else if ( dataType == "mine") {
            q1 = `SELECT * FROM contents WHERE writer='${reqEmail}'`;
        } else if ( dataType == "single"){
            q1 = `SELECT * FROM contents WHERE writer='${reqEmail}'`;
        }

        models.sequelize.query(q1).then(function(result) {
            console.log(JSON.stringify(result[0]));
            res.json(result[0]);
        });        
    } catch (err) {
        console.log(err);
    }
});





// Delete Content by { Contents_id }
router.delete('/delete/:contents_id', function (req, res) {
    try {
        let contentId = req.params.contents_id;
        let q1 = 
        'SELECT writer, contents_id, image_path, contents_cnt ' +
        'FROM contents a ' +
        'RIGHT JOIN users b ' +
        'ON a.writer = b.email ' +
        'WHERE contents_id = :contentId'
        let q2 = 'DELETE FROM contents WHERE contents_id = :contentId'
        let q3 = 'UPDATE users SET contents_cnt = :contentsCnt WHERE email = :email'
        
        // 1. select query
        models.sequelize.query(q1, {replacements: {contentId: contentId}})
        .then(([result1, metadata]) => {
            console.log("\n" + JSON.stringify(result1[0]) + "\n");

            // 2. File Delete.
            fs.unlinkSync('/Users/mac/JstargramServer/' + result1[0].image_path);

            models.sequelize.query(q2, {replacements: {contentId: contentId}})
            .then(result => {

                // 3. Update count.
                models.sequelize.query(q3, { 
                    replacements: {
                        contentsCnt: result1[0].contents_cnt - 1,
                        email : result1[0].writer
                    }
                }).then(result => {
                    console.log("success Delete")
                    const obj = { 
                        resCode : "200",
                        resMsg  : "Success Delete Contents and Update Count",
                        contentsCnt : result1[0].contents_cnt - 1
                    }
                    res.json(obj);
                }).catch(err => {
                    console.log(err);
                    const obj = {
                        resCode : "444",
                        resMsg  : "Failed Delete contents and Update Count",
                        contentsCnt : result1[0].contents_cnt
                    }
                    res.json(obj);
                })
            }).catch(err => { console.log(err); })
        }).catch(err => {console.log(err);
        });
    } catch (err) {
        console.log(err);
    }
})



module.exports = router;