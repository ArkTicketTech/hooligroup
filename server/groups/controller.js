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
		} else {
			let groupInfo = groupDoc
			let groupMembers = []
			let groupEvents = []
			Promise.all(
				groupDoc.members.map(function (member) {
					return model.User.findById(member, {
						password: 0,
						token: 0,
						groups: 0,
						create_time: 0
					}, function (err, memberDoc) {
						if (err) {
							return Promise.reject()
						} else {
							groupMembers.push(memberDoc)
							return Promise.resolve()
						}
					})
				})
			).then(() => {
				return Promise.all(groupDoc.events.map(function (event) {
					return model.Event.findById(event, function (err, eventDoc) {
						if (err) {
							return Promise.reject()
						} else {
							console.log(eventDoc, 'getGroupInfo eventDoc')
							groupEvents.push(eventDoc)
							return Promise.resolve()
						}
					})
				}))
			}).then(function () {
				groupInfo.members = groupMembers
				console.log(groupInfo)
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