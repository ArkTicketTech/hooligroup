const mongoose = require('../db/mongoose')

var topicSchema = mongoose.Schema({
	title: String,
	content: String,
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
	section: String,
	likes: Number,
	views: Number
})

var Topic = mongoose.model('Topic', topicSchema)

module.exports = Topic