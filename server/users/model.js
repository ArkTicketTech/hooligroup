const mongoose = require('../db/mongoose')

var userSchema = mongoose.Schema({
	username: String,
	name: String,
	password: String,
	recheck: String,
	token: String,
	create_time: Date
})

var User = mongoose.model('User', userSchema)

module.exports = User