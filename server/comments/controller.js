const express = require('express')
const model = require('../db/model.js')
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const checkToken = require('../middleware/checkToken.js')
const getToken = require('../middleware/getToken.js')

// 创建comment
const Create = (req, res) => {
	let user = getToken(req, res)

	// create comment
	let commentCreate = new model.Comment({
		content: req.body.content,
		user: user.id,
		likes: 0
	})
	// check if the groupId is legal
	model.Topic.findById(req.body.topic, function (err, topicDoc) {
		if (err) {
			console.log(err)
			res.send(err)
		} else {
			// TODO: Only member of this group can comment
			commentCreate.save((err, comment) => {
				if (err) {
					console.log(err)
					return handleError(err)
				}
				// add this comment to group comments set
				topicDoc.comments.addToSet(comment.id)
				topicDoc.save(function (err, updatedTopic) {
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


module.exports = {
	Create
}