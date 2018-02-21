const express = require('express')
const model = require('../db/model.js')
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const createToken = require('../middleware/createToken.js')
const sha1 = require('sha1')
const getToken = require('../middleware/getToken.js')

// 删除用户
const Vote = (req, res) => {
	//TODO: the date format is like '2018-01-01T16:00:00.000Z' seems diffirent to the origin date post to server
	// the original date looks like 'Tue Jan 02 2018 00:00:00 GMT+0800 (CST)'
	let vote = new model.Vote({
		name: req.body.name,
		date: moment(req.body.date).format('YYYY-MM-DD HH:mm:ss')
	})
	model.Vote.findOne({
		name: (vote.name)
	}, (err, doc) => {
		if (err) console.log(err)
		// 用户名已存在，不能注册
		if (doc) {
			console.log(doc)
			doc.date = req.body.date
			doc.exam = req.body.exam
			doc.save();
			res.json({
				success: true
			})
		} else {
			vote.save(err => {
				if (err) console.log(err)
				console.log('vote success')
				res.json({
					success: true
				})
			})
		}
	})

}

module.exports = {
	Vote
}