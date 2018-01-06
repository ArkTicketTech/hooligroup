const mongoose = require('mongoose')
const config = require('config-lite')

// mongodb 连接🔗
mongoose.connect(config.mongodb)
// 此处防止 node.js - Mongoose: mpromise 错误
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connect error'))
db.once('open', function () {
	console.log('Mongodb started successfully')
})


var userSchema = mongoose.Schema({
	username: String,
	name: String,
	password: String,
	recheck: String,
	token: String,
	create_time: Date
})

var groupSchema = mongoose.Schema({
	name: String,
	type: String,
	description: String,
	members: [String],
	create_time: Date,
	events: [String]
})

var eventSchema = mongoose.Schema({
	name: String,
	type: String,
	tags: [String],
	members: [String],
	location: String,
	begin_time: Date,
	end_time: Date,
	enroll_begin_time: Date,
	enroll_end_time: Date
})

var voteSchema = mongoose.Schema({
	name: String,
	date: Date
})

var model = {
	// 在此处扩展 model，例如：
	User: mongoose.model('User', userSchema),
	Group: mongoose.model('Group', groupSchema),
	Event: mongoose.model('Event', eventSchema),
	Vote: mongoose.model('Vote', voteSchema)
}

module.exports = model