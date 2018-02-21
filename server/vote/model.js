const mongoose = require('../db/mongoose')

var voteSchema = mongoose.Schema({
	name: String,
	date: Date
})

var Vote = mongoose.model('Vote', voteSchema)

module.exports = Vote