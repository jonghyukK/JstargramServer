const express = require('express');
const router = express.Router();
const models = require('../models');
const crypto = require('crypto');
const fs = require('fs');

const multer = require('multer');

let storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, 'profile_images/');
	},
	filename: function (req, file, callback) {
		callback(null, file.originalname + '-' + Date.now());
	},
});

let upload = multer({
	storage: storage,
});

/***************************************************************************
 *
 *   이메일 등록시, 이메일 유효성 Check.
 *
 ***************************************************************************/
router.get('/validateEmail/:email', function (req, res, next) {
	let reqEmail = req.params.email;

	models.user.findOne({where: { email: reqEmail }})
		.then(result => {
			if (result != null) {
				const obj = {
					resCode: '444',
					resMsg: 'already exist Email'
				};
				res.json(obj);
			} else {
				const obj = {
					resCode: '200',
					resMsg: 'validate email'
				};
				res.json(obj);
			}
		})
		.catch(err => {
			console.log(err);
		});
});


/****************************************************************************
 *
 *  유저 정보 Select ( by Email )
 *
 ***************************************************************************/
router.get('/getUser/:email', function (req, res, next) {
	let reqEmail = req.params.email;

	models.user.findOne({
		where: { email: reqEmail },
	})
		.then(result => {
			if (result != null) {
				const obj = {
					resCode: '200',
					resMsg: 'Success Query',
					email: result.email,
					name: result.name,
					introduce: result.introduce,
					profile_img: result.profile_img,
					contents_cnt: result.contents_cnt,
					follower_cnt: result.follower_cnt,
					following_cnt: result.following_cnt,
				};
				res.json(obj);
			} else {
				const obj = {
					resCode: '444',
					resMsg: 'not exist Users'
				};
				res.json(obj);
			}
		})
		.catch(err => {
			console.log(err);
		});
});


/****************************************************************************
 *
 *  유저 정보 업데이트 API.
 *
 ***************************************************************************/
// Update User (profile (x))
router.put('/updateUser/:email', function (req, res, next) {
	try {
		let reqEmail = req.params.email;
		let params = {
			name: req.body.name,
			introduce: req.body.introduce,
			profile_img: req.body.profile_img,
		};

		models.user.update(params, {
			where: { email: reqEmail },
		})
			.then(result => {
				if (result == 1) {
					models.user.findByPk(reqEmail).then(user => {
						console.log(user.dataValues);
						res.json(user.dataValues);
					});
				}
			})
			.catch(err => {
				console.log('User Update Failed');
			});
	} catch (e) {
		console.log(e);
	}
});

// Update User (profile (o))
router.post('/updateUser', upload.single('image'), function (req, res) {
	try {
		let email  = req.body.email;			// email
		let params = {
			name        : req.body.name,		// name
			introduce   : req.body.introduce,   // introduce
			profile_img : req.file.path			// profile images
		}

		models.user.findOne({ where: { email: email } })
			.then(result => {
				try {
					// profile이 있으면 기존 파일 삭제 후 생성.
					if (result.dataValues.profile_img != null) {
						fs.unlinkSync('/Users/mac/JstargramServer/' + result.dataValues.profile_img);
						console.log('Successfully deleted File')
					}

					// User Update.
					models.user.update(params, {
						where: { email: email }
					}).then(result => {
						if (result == 1) {
							// content Profile Update.
							models.contents.update( {writer_profile: req.file.path }, { 
								where: { writer: email } 
							}).then(result => {
								models.user.findByPk(email).then(user => {
									console.log(user.dataValues);
									res.json(user.dataValues);
								});
							})
							.catch(err => {
								console.log(err);
							});
						}
					});
				} catch (err) {
					console.log(err);
				}
			});
	} catch (e) {
		console.log(e);
	}
});

/****************************************************************************
 *
 *  유저 등록 API
 *
 ***************************************************************************/
router.post('/sign_up', function (req, res, next) {
	let body = req.body;

	let inputPassword = body.password;
	let salt = Math.round(new Date().valueOf() * Math.random()) + '';
	let hashPassword = crypto
		.createHash('sha512')
		.update(inputPassword + salt)
		.digest('hex');

	models.user
		.create({
			name: body.name,
			email: body.email,
			password: hashPassword,
			salt: salt,
		})
		.then(result => {
			if (result.email != null) {
				const obj = {
					resCode: '200',
					resMsg: 'Success SignUp'
				};
				res.json(obj);
			} else {
				const obj = {
					resCode: '444',
					resMsg: 'Failed SignUp'
				};
				res.json(obj);
			}
		})
		.catch(err => {
			console.log(err);
			const obj = {
				resCode: '444',
				resMsg: 'Email validation Error'
			};
			res.json(obj);
		});
});

/****************************************************************************
 *
 *  로그인 API.
 *
 ***************************************************************************/
router.post('/login', function (req, res, next) {
	let body = req.body;

	models.user.findOne({
		where: { email: body.email },
	})
		.then(result => {
			let dbPassword = result.dataValues.password;

			let inputPassword = body.password;
			let salt = result.dataValues.salt;
			let hashPassword = crypto
				.createHash('sha512')
				.update(inputPassword + salt)
				.digest('hex');

			if (dbPassword === hashPassword) {
				console.log('비밀번호 일치');
				const obj = {
					resCode: '200',
					resMsg: 'Success Login',
				};
				res.json(obj);
			} else {
				console.log('비밀번호 불일치');
				const obj = {
					resCode: '444',
					resMsg: 'Failed Login',
				};
				res.json(obj);
			}
		})
		.catch(err => {
			console.log(err);
			const obj = {
				resCode: '444',
				resMsg: 'UnRegisted Email.',
			};
			res.json(obj);
		});
});

module.exports = router;
