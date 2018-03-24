const express = require('express')
const model = require('../db/model.js')
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const checkToken = require('../middleware/checkToken.js')
const getToken = require('../middleware/getToken.js')
var async = require("async");

// 创建topic
const Create = (req, res) => {
	let user = getToken(req, res)

	// create topic
	let topicCreate = new model.Topic({
		title: req.body.title,
		content: req.body.content,
		section: req.body.section,
		group: req.body.group,
		user: user.id,
		likes: 0,
		views: 0
	})
	// check if the groupId is legal
	model.Group.findById(req.body.group, function (err, groupDoc) {
		if (err) {
			console.log(err)
			res.send(err)
		} else {
			// TODO: find out why includes not working here
			if (groupDoc.admins.indexOf(user.id) === -1 && groupDoc.members.indexOf(user.id) === -1) {
				res.json({ success: false })
				return
			}
			topicCreate.save((err, topic) => {
				if (err) {
					console.log(err)
					return handleError(err)
				}
				// add this topic to group topics set
				groupDoc.topics.addToSet(topic.id)
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

// Topic Info
const GetTopicInfoById = (req, res) => {
	model.Topic.findById(req.query.id)
		.populate('user')
		.populate({
			path: 'comments',
			populate: {
				path: 'user',
				select: {
					password: 0,
					token: 0,
					groups: 0,
					create_time: 0
				}
			}
		})
		.exec((err, topic) => {
			if (err || !topic) {
				res.json({
					success: false
				})
				return
			}
			res.send(topic)
		})
}

// Delete topic
const DeleteTopic = (req, res) => {
	let isSuccess = true
	async.waterfall([
		function (callback) {
			// code a: Remove Topic
			model.Topic.findOneAndRemove(
				{ _id: req.body.id },
				function (err, topic) {
					if (err) callback(err)
					callback(null, topic)
				}
			);
		},

		function (doc, callback) {
			// code b: Remove associated comments
			if (!doc) {
				callback(new Error('null topic'))
				return
			}
			var commentList = doc.comments || [];
			model.Comment
				.remove({ "_id": { "$in": commentList } })
				.exec(
					function (err, res) {
						if (err) callback(err)
						callback(null, doc)
					}
				)
		}
	], function (err, result) {
		if (err) res.json({success: false})
		else res.json({success: true})
	})
}

module.exports = {
	Create,
	GetTopicInfoById,
	DeleteTopic
}