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
	groups: [String],
	create_time: Date
})

var groupSchema = mongoose.Schema({
	name: String,
	type: String,
	description: String,
	members: [String],
	create_time: Date
})

var eventSchema = mongoose.Schema({
	name: String,
	type: String
})

var model = {
	// 在此处扩展 model，例如：
	User: mongoose.model('User', userSchema),
	Group: mongoose.model('Group', groupSchema),
	Event: mongoose.model('Event', eventSchema)
}

module.exports = model