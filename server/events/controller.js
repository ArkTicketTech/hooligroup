const express = require('express')
const model = require('../db/model.js')
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
		end_time: req.body.end_time,
		begin_time: req.body.begin_time,
		enroll_end_time: req.body.enroll_end_time,
		info: req.body.info,
		location: req.body.location
	})
	// check if the groupId is legal
	model.Group.findById(req.body.group, function (err, groupDoc) {
		if (err) {
			console.log(err)
			res.send(err)
		} else {
			// TODO: find out why includes not working here
			if (groupDoc.admins.indexOf(user.id) === -1) {
				res.json({ success: false })
				return
			}
			eventCreate.save((err, event) => {
				if (err) {
					console.log(err)
					return handleError(err)
				}
				// add this event to group events set
				groupDoc.events.addToSet(event.id)
				groupDoc.save(function (err, updatedGroup) {
					if (err) {
						console.log(err)
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
	model.Event.findById(req.query.id)
		.populate({
			path: 'members',
			select: {
				password: 0,
				token: 0,
				groups: 0,
				create_time: 0
			}
		})
		.exec((err, event) => {
			if (err || !event) {
				res.json({
					success: false
				})
				return
			}
			res.send(event)
		})
}

module.exports = {
	Events,
	Create,
	GetEventInfoById
}