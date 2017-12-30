const express = require('express')
const model = require('../db/db.js')
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const createToken = require('../middleware/createToken.js')
const sha1 = require('sha1')
const getToken = require('../middleware/getToken.js')

// 删除用户
const Vote = (req, res) => {
	let vote = new model.Vote({
		name: req.body.name,
		date: req.body.date
	})

	vote.save(err => {
		if (err) console.log(err)
		console.log('vote success')
		res.json({
			success: true
		})
	})
}

module.exports = {
	Vote
}