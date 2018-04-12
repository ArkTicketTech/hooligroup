const express = require('express')
const model = require('../db/model.js')
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const createToken = require('../middleware/createToken.js')
const sha1 = require('sha1')
const getToken = require('../middleware/getToken.js')
const config = require('config-lite')
const request = require('request')

const LoginByJaccount = (req, nRes) => {
	let statusCode
	let jaccountEntity = null
	let isSuccess = true
	let user = null
	request
		.post({
			url: 'https://jaccount.sjtu.edu.cn/oauth2/token',
			form: {
				client_id: config.J_CLIENT_ID,
				client_secret: config.J_CLIENT_SECRET,
				grant_type: 'authorization_code',
				code: req.body.code,
				redirect_uri: config.BASE_URL + 'oauth/jaccount'
			}
		}, function (err, res, body) {
			let statusCode = res.statusCode
			let access_token = JSON.parse(body).access_token
			if (err) isSuccess = false
			if (res.statusCode === 200 && isSuccess) {
				request.get({
					url: 'https://api.sjtu.edu.cn/v1/me/profile?access_token=' + access_token
				}, function (err, res, body) {
					if (err) isSuccess = false
					if (res.statusCode !== 200) isSuccess = false
					jaccountEntity = JSON.parse(body).entities[0]
					if (isSuccess && jaccountEntity) {
						model.User.findOne({
							j_id: jaccountEntity.id
						}, (err, userDoc) => {
							if (err) {
								isSuccess = false
								nRes.json({
									success: false
								})
								return
							}
							if (!userDoc) {
								let userRegister = new model.User({
									j_username: jaccountEntity.account,
									j_id: jaccountEntity.id,
									name: jaccountEntity.name,
									token: createToken(this.j_username, this._id)
								})
								userRegister.create_time = moment(objectIdToTimestamp(userRegister._id))
									.format('YYYY-MM-DD HH:mm:ss');
								userRegister.save((err, userDoc) => {
									if (err) {
										isSuccess = false
										nRes.json({
											success: isSuccess
										})
										return
									}
									user = userDoc
									if (!isSuccess || !user) {
										nRes.json({ success: false })
									} else {
										nRes.json({
											success: isSuccess,
											username: user.j_username,
											_id: user._id,
											// 账户创建日期
											time: moment(objectIdToTimestamp(user._id))
												.format('YYYY-MM-DD HH:mm:ss'),
											// token 信息验证
											token: createToken(user.j_username, user._id)
										})
									}
								})
							} else {
								user = userDoc
								if (!isSuccess || !user) {
									nRes.json({ success: isSuccess })
								} else {
									nRes.json({
										success: isSuccess,
										username: user.j_username,
										_id: user._id,
										// 账户创建日期
										time: moment(objectIdToTimestamp(user._id))
											.format('YYYY-MM-DD HH:mm:ss'),
										// token 信息验证
										token: createToken(user.name, user._id)
									})
								}
							}
						})
					} else {
						nRes.json({
							success: false
						})
					}
				})
			} else {
				nRes.json({
					success: false
				})
			}
		})

}

// 注册
const Register = (req, res) => {
	let userRegister = new model.User({
		username: req.body.username,
		password: sha1(req.body.password),
		recheck: req.body.recheck,
		name: req.body.name,
		token: createToken(this.username, this._id)
	})

	// 将 objectid 转换为 用户创建时间
	userRegister.create_time = moment(objectIdToTimestamp(userRegister._id))
		.format('YYYY-MM-DD HH:mm:ss');

	model.User.findOne({
		username: (userRegister.username)
			.toLowerCase()
	}, (err, doc) => {
		if (err) console.log(err)
		// 用户名已存在，不能注册
		if (doc) {
			res.json({
				success: false
			})
		} else {
			userRegister.save(err => {
				if (err) console.log(err)
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
		token: createToken(this.username, this._id),
	})
	model.User.findOne({
		username: userLogin.username
	}, (err, doc) => {
		if (err) console.log(err)
		if (!doc) {
			console.log("账号不存在");
			res.json({
				info: false
			})
		} else if (userLogin.password === doc.password) {
			console.log('登录成功')
			var name = req.body.username;
			res.json({
				success: true,
				username: doc.username,
				_id: doc._id,
				// 账户创建日期
				time: moment(objectIdToTimestamp(doc._id))
					.format('YYYY-MM-DD HH:mm:ss'),
				// token 信息验证
				token: createToken(name, doc._id)
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
		if (err) console.log(err)
		res.send(doc)
	})
}

// 更新用户信息
const UpdateUserInfo = (req, res) => {
	let user = getToken(req, res)
	if (!user) {
		console.log("账号不存在")
		res.json({
			info: false
		})
		return
	}
	console.log(req.body)
	console.log(user)
	model.User.findByIdAndUpdate(
		user.id,
		{
			name: req.body.name
		},
		(err, updatedUser) => {
			if (err) {
				console.log(err)
				res.json({
					success: false
				})
			} else {
				console.log('更新用户信息成功')
				res.json({
					success: true
				})
			}
		})
}

// 更新密码
const UpdatePassword = (req, res) => {
	let user = getToken(req, res)
	if (!user) {
		console.log("账号不存在")
		res.json({
			info: false
		})
	} else {
		let updatePassword = {
			oldPassword: req.body.oldPassword,
			newPassword: req.body.newPassword
		}
		model.User.findById(user.id, (err, doc) => {
			if (!doc) {
				res.json({ success: false })
				return
			}
			if (doc.password !== sha1(updatePassword.oldPassword)) {
				console.log('密码错误')
				res.json({
					success: false
				})
			} else {
				model.User.findByIdAndUpdate(
					user.id,
					{ password: sha1(updatePassword.newPassword) },
					(err, updatedUser) => {
						if (err) {
							console.log(err)
							res.json({
								success: false
							})
						} else {
							console.log('更新密码成功')
							res.json({
								success: true
							})
						}
					})
			}
		})
	}
}

// 删除用户
const DelUser = (req, res) => {
	model.User.findOneAndRemove({
		_id: req.body.id
	}, err => {
		if (err) console.log(err)
		console.log('删除用户成功')
		res.json({
			success: true
		})
	})
}

// 用户加入group
const JoinGroup = (req, res) => {
	let user = getToken(req, res)
	if (user) {
		model.Group.findById(req.body.id, (err, doc) => {
			// doc.set({members:[]})			
			doc.pendingMembers.addToSet(user.id)
			doc.save(function (err, updatedGroup) {
				if (err) res.send(err)
			})
		})
		// model.User.findById(user.id, (err, doc) => {
		// 	doc.groups.addToSet(req.body.id)
		// 	doc.save(function (err, updatedUser) {
		// 		if (err) res.send(err)
		// 	})
		// })
		res.json({
			success: true
		})
	}
}

// 管理员通过用户加入小组请求
const ConfirmJoinGroup = (req, res) => {
	let user = getToken(req, res)
	let isSuccess = true
	if (user) {
		model.Group.findById(req.body.gid, (err, doc) => {
			if (doc.admins.indexOf(user.id) === -1) {
				isSuccess = false;
			}
			doc.pendingMembers = doc.pendingMembers.filter((member) => {
				return member != req.body.uid
			})
			doc.members.addToSet(req.body.uid)
			doc.save(function (err, updatedGroup) {
				if (err) {
					console.log(err)
					isSuccess = false
				}
			})
		})
		model.User.findById(req.body.uid, (err, doc) => {
			doc.groups.addToSet(req.body.id)
			doc.save(function (err, updatedUser) {
				if (err) {
					console.log(err)
					isSuccess = false
				}
			})
		})
	}
	res.json({ success: isSuccess })
}

// 用户退出group
const LeaveGroup = (req, res) => {
	let user = getToken(req, res)
	if (user) {
		model.Group.findById(req.body.id, (err, groupDoc) => {
			// TODO: I think use filter to remove members is too dangerous.
			if (groupDoc.members) {
				groupDoc.members = groupDoc.members.filter((member) => {
					return member != user.id
				})
				groupDoc.pendingMembers = groupDoc.pendingMembers.filter((member) => {
					return member != user.id
				})
				groupDoc.save((err, updatedGroup) => {
					if (err) console.log(err)
				})
			}
		})
		model.User.findById(user.id, (err, userDoc) => {
			if (userDoc.groups) {
				userDoc.groups = userDoc.groups.filter((group) => {
					return group != req.body.id
				})
				userDoc.save((err, updatedUser) => {
					if (err) console.log(err)
				})
			}
		})
		res.json({
			success: true
		})
	}
}

// 用户加入event
const JoinEvent = (req, res) => {
	let isSuccess = true;
	let user = getToken(req, res)
	if (user) {
		model.Event.findById(req.body.id, (err, doc) => {
			if (doc) {
				doc.members.addToSet(user.id)
				doc.save(function (err, updatedEvent) {
					if (err) res.send(err)
				})
			} else {
				isSuccess = false;
			}
		})
		res.json({
			success: isSuccess
		})
	}
}

// 用户退出event
const LeaveEvent = (req, res) => {
	let isSuccess = true;
	let user = getToken(req, res)
	if (user) {
		model.Event.findById(req.body.id, (err, eventDoc) => {
			if (eventDoc.members) {
				eventDoc.members = eventDoc.members.filter((member) => {
					return member != user.id
				})
				eventDoc.save((err, updatedEvent) => {
					if (err) console.log(err)
					isSuccess = false;
				})
			}
		})
	}
	res.json({
		success: isSuccess
	})
}

module.exports = {
	Register,
	Login,
	User,
	UpdateUserInfo,
	UpdatePassword,
	DelUser,
	JoinGroup,
	LeaveGroup,
	JoinEvent,
	LeaveEvent,
	ConfirmJoinGroup,
	LoginByJaccount
}