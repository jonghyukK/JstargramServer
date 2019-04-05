var express = require('express');
var models = require('../models');
var router = express.Router();



router.get('/show', function(req, res, next){
  models.members.findAll().then( result => {
    res.render("show", {
      members: result
    });
  });
});

router.post('/create', function(req, res, next){
  let body = req.body

  models.members.create({
    email: body.inputEmail,
    name : body.inputName,
    password: body.inputPassWord
  })
  .then( result => {
    console.log("Success Data add");
  })
  .catch( err => {
    console.log("Failed Data Add")
  })
});

module.exports = router;
