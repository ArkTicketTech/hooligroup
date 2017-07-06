const express = require('express')
const model = require('../db/db.js')
const router = express.Router()
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const createToken = require('../middleware/createToken.js')
const sha1 = require('sha1')
const checkToken = require('../middleware/checkToken.js')

// 所有group打印
const Groups = (req, res) => {
	model.Group.find({}, (err, doc) => {
		if(err) console.log(err)
		res.send(doc)
	})
}

module.exports = (router) => {
	router.get('/groups', checkToken, Groups)
}
