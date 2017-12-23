const express = require('express')
const model = require('../db/db.js')
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
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

// Group info
const GetGroupInfoById = (req, res) => {
	model.Group.findById(req.query.id, function (err, doc) {
		if (err) {
			console.log(err)
		} else {
			let groupInfo = doc
			let groupMembers = []
			Promise.all(doc.members.map(function (member) {
				return model.User.findById(member, {
					password: 0,
					token: 0,
					groups: 0,
					create_time: 0
				}, function (err, doc) {
					if (err) {
						return Promise.reject()
					} else {
						groupMembers.push(doc)
						return Promise.resolve()
					}
				})
			})).then(function (result) {
				groupInfo.members = groupMembers
				res.send(groupInfo)
			}, function (err) {
				console.log(err)
				res.json({
					success: false
				})
			})
		}
	})
}

module.exports = {
	Groups,
	Create,
	GetGroupInfoById
}