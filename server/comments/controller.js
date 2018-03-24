const express = require('express')
const model = require('../db/model.js')
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const checkToken = require('../middleware/checkToken.js')
const getToken = require('../middleware/getToken.js')
var async = require("async");

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
	console.log(req.body.topic)
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
				topicDoc.save(function (err, updatedComment) {
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

// Delete Comment
const Delete = (req, res) => {
	let isSuccess = true
	if (!req.body.id) {
		res.json({success: false})
		return
	}
	async.waterfall([
		function (callback) {
			// code a: Remove Comment
			model.Comment.findOneAndRemove(
				{ _id: req.body.id },
				function (err, comment) {
					if (err) callback(err)
					callback(null, comment)
				}
			);
		},

        function (doc, callback) {
			// code c: Remove related topic
			if (!doc) {
				callback(new Error('null comment'))
				return
			}
            model.Topic.update(
                { "comments": doc._id },
                { "$pull": { "comments": doc._id } },
                function (err, res) {
                    if (err) callback(err);
                    callback(null, doc);
                }
            );
        }
	], function (err, result) {
		if (err) res.json({success: false})
		else res.json({success: true})
	})
}


module.exports = {
	Create,
	Delete
}