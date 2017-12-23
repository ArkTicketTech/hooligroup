const userController = require('./controller')
const checkToken = require('../middleware/checkToken.js')

module.exports = (router) => {
	router.get('/groups', checkToken, userController.Groups)
		.post('/group/create', userController.Create)
		.get('/group/getGroupInfoById', checkToken, userController.GetGroupInfoById)
}