const User = require('../users/model')
const Group = require('../groups/model')
const Event = require('../events/model')
const Vote = require('../vote/model')

var model = {
	// 在此处扩展 model，例如：
	User: User,
	Group: Group,
	Event: Event,
	Vote: Vote
}

module.exports = model