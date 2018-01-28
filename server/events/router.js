const eventController = require('./controller')
const checkToken = require('../middleware/checkToken.js')

module.exports = (router) => {
	router.get('/events', checkToken, eventController.Events)
		.post('/event/create', eventController.Create)
		.get('/event/getEventInfoById', checkToken, eventController.GetEventInfoById)
}