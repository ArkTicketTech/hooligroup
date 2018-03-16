const User = require('../users/model')
const Group = require('../groups/model')
const Event = require('../events/model')
const Comment = require('../comments/model')
const Topic = require('../topics/model')
const Vote = require('../vote/model')

var model = {
	// 在此处扩展 model，例如：
	User: User,
	Group: Group,
	Event: Event,
	Topic: Topic,
	Comment: Comment,
	Vote: Vote
}

module.exports = model