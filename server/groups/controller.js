const express = require('express')
const model = require('../db/db.js')
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const checkToken = require('../middleware/checkToken.js')
const getToken = require('../middleware/getToken.js')

// 所有group打印
const Groups = (req, res) => {
	model.Group.find({}, (err, doc) => {
		if (err) console.log(err)
		res.send(doc)
	})
}

// 创建group
const Create = (req, res) => {
	let user = getToken(req, res)

	let groupCreate = new model.Group({
		name: req.body.name,
		type: req.body.type,
		description: req.body.description,
		admins: [user.id]
	})
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
	model.Group.findById(req.query.id, function (err, groupDoc) {
		if (err) {
			console.log(err)
			res.json({
				success: false
			})
		} else {
			let groupInfo = groupDoc
			let groupMembers = []
			let groupEvents = []
			if (!groupInfo) {
				res.json({
					success: false
				})
				return
			}
			Promise.all(
				groupInfo.members.map(function (member) {
					return model.User.findById(member, {
						password: 0,
						token: 0,
						groups: 0,
						create_time: 0
					}, function (err, memberDoc) {
						if (err) {
							return Promise.reject()
						} else {
							groupMembers.push(memberDoc.toObject())
							return Promise.resolve()
						}
					})
				})
			).then(() => {
				return Promise.all(groupInfo.events.map(function (event) {
					return model.Event.findById(event, function (err, eventDoc) {
						if (err) {
							return Promise.reject()
						} else {
							groupEvents.push(eventDoc.toObject())
							console.log(groupEvents, 'groupEvents')
							return Promise.resolve()
						}
					})
				}))
			}).then(function () {
				groupInfo = groupInfo.toObject()
				groupInfo.members = groupMembers
				groupInfo.events = groupEvents
				res.send(JSON.stringify(groupInfo))
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