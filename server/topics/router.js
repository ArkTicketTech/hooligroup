const topicController = require('./controller')
const checkToken = require('../middleware/checkToken.js')

module.exports = (router) => {
	router.post('/topic/create', checkToken, topicController.Create)
}