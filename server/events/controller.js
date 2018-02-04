const express = require('express')
const model = require('../db/db.js')
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const checkToken = require('../middleware/checkToken.js')
const getToken = require('../middleware/getToken.js')

// 所有event打印
const Events = (req, res) => {
	model.Event.find({}, (err, doc) => {
		if (err) console.log(err)
		res.send(doc)
	})
}

// 创建event
const Create = (req, res) => {
	let user = getToken(req, res)

	// create event
	let eventCreate = new model.Event({
		name: req.body.name,
		begin_time: req.body.begin_time,
		enroll_begin_time: req.body.enroll_begin_time,
		location: req.body.location
	})
	// check if the groupId is legal
	model.Group.findById(req.body.group, function (err, groupDoc) {
		if (err) {
			console.log(err)
			res.send(err)
		} else {
			// create event
			console.log(groupDoc)
			if (!groupDoc.admins.includes(user.id))
				res.send(err)
			eventCreate.save( (err, event) => {
				if (err) {
					console.log(err)
					return handleError(err)
				}
				// add this event to group events set
				groupDoc.events.addToSet(event.id)
				groupDoc.save(function (err, updatedGroup) {
					if (err) {
						res.send(err)
					} else {
						res.json({
							success: true
						})
					}
				})
			})
		}
	})

}

// Event Info
const GetEventInfoById = (req, res) => {
	let eventMembers = []
	model.Event.findById(req.query.id, function (err, eventDoc) {
		if (err) {
			console.log(err)
			res.json({
				success: false
			})
		} else {
			let eventInfo = eventDoc
			Promise.all(
				eventInfo.members.map(function (member) {
					return model.User.findById(member, {
						password: 0,
						token: 0,
						groups: 0,
						create_time: 0
					}, function (err, memberDoc) {
						if (err) {
							return Promise.reject()
						} else {
							eventMembers.push(memberDoc.toObject())
							return Promise.resolve()
						}
					})
				})
			).then(function () {
				eventInfo = eventInfo.toObject()
				eventInfo.members = eventMembers
				res.send(JSON.stringify(eventInfo))
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
	Events,
	Create,
	GetEventInfoById
}