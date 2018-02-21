const mongoose = require('../db/mongoose')

var groupSchema = mongoose.Schema({
	name: String,
	type: String,
	description: String,
	members: [String],
	admins: [String],
	create_time: Date,
	events: [String]
})

var Group = mongoose.model('Group', groupSchema)

module.exports = Group