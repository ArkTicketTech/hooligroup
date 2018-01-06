const express = require('express')
const model = require('../db/db.js')
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const checkToken = require('../middleware/checkToken.js')

// 所有event打印
const Events = (req, res) => {
	model.Event.find({}, (err, doc) => {
		if (err) console.log(err)
		res.send(doc)
	})
}

// name: String,
// type: String,
// tags: [String],
// members: [String],
// location: String,
// begin_time: Date,
// end_time: Date,
// enroll_begin_time: Date,
// enroll_end_time: Date

// 创建event
const Create = (req, res) => {
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
			eventCreate.save(err => {
				if (err) {
					console.log(err)
					return handleError(err)
				}
				// add this event to group events set
				groupDoc.events.addToSet(req.body.group)
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

module.exports = {
	Events,
	Create
}