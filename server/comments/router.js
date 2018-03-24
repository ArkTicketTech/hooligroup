const commentController = require('./controller')
const checkToken = require('../middleware/checkToken.js')

module.exports = (router) => {
	router.post('/comment/create', checkToken, commentController.Create),
	router.post('/comment/delete', checkToken, commentController.Delete)
}