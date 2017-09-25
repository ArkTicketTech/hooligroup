const express = require('express')
const model = require('../db/db.js')
const router = express.Router()
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const sha1 = require('sha1')
const checkToken = require('../middleware/checkToken.js')

// 所有group打印
const Groups = (req, res) => {
	model.Group.find({}, (err, doc) => {
		if (err) console.log(err)
		res.send(doc)
	})
}

// 创建group
const Create = (req, res) => {
	let groupCreate = new model.Group({
		name: req.body.name,
		type: req.body.type,
		description: req.body.description
	})
	console.log(groupCreate);
	// 将 objectid 转换为 用户创建时间
	groupCreate.create_time = moment(objectIdToTimestamp(groupCreate._id))
		.format('YYYY-MM-DD HH:mm:ss');
	groupCreate.save(err => {
		if (err) console.log(err)
		console.log('create success')
		res.json({
			success: true
		})
	})
}

module.exports = (router) => {
	router.get('/groups', checkToken, Groups)
		.post('/group/create', Create)
}