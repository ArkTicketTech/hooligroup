const express = require('express')
const model = require('../db/db.js')
const router = express.Router()
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const createToken = require('../middleware/createToken.js')
const sha1 = require('sha1')
const checkToken = require('../middleware/checkToken.js')

// 注册
const Register = (req, res) => {
	let userRegister = new model.User({
		username: req.body.username,
		password: sha1(req.body.password),
		recheck: req.body.recheck,
		token: createToken(this.username)
	})

	// 将 objectid 转换为 用户创建时间
	userRegister.create_time = moment(objectIdToTimestamp(userRegister._id))
		.format('YYYY-MM-DD HH:mm:ss');

	model.User.findOne({
		username: (userRegister.username)
			.toLowerCase()
	}, (err, doc) => {
		if(err) console.log(err)
		// 用户名已存在，不能注册
		if(doc) {
			res.json({
				success: false
			})
		} else {
			userRegister.save(err => {
				if(err) console.log(err)
				console.log('register success')
				res.json({
					success: true
				})
			})
		}
	})
}

// 登录
const Login = (req, res) => {
	let userLogin = new model.User({
		username: req.body.username,
		password: sha1(req.body.password),
		token: createToken(this.username)
	})
	model.User.findOne({ username: userLogin.username }, (err, doc) => {
		if(err) console.log(err)
		if(!doc) {
			console.log("账号不存在");
			res.json({
				info: false
			})
		} else if(userLogin.password === doc.password) {
			console.log('登录成功')
			var name = req.body.username;
			res.json({
				success: true,
				username: doc.username,
				// 账户创建日期
				time: moment(objectIdToTimestamp(doc._id))
					.format('YYYY-MM-DD HH:mm:ss'),
				// token 信息验证
				token: createToken(name)
			})
		} else {
			console.log('密码错误')
			res.json({
				success: false
			})
		}
	})
}

// 所有用户打印
const User = (req, res) => {
	model.User.find({}, (err, doc) => {
		if(err) console.log(err)
		res.send(doc)
	})
}

// 删除用户
const delUser = (req, res) => {
	model.User.findOneAndRemove({ _id: req.body.id }, err => {
		if(err) console.log(err)
		console.log('删除用户成功')
		res.json({
			success: true
		})
	})
}

module.exports = (router) => {
	router.post('/register', Register),
		router.post('/login', Login),
		router.get('/user', checkToken, User),
		router.post('/delUser', checkToken, delUser)
}
