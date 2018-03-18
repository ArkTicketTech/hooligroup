const groupController = require('./controller')
const checkToken = require('../middleware/checkToken.js')

module.exports = (router) => {
	router.get('/groups', checkToken, groupController.Groups)
		.post('/group/create', groupController.Create)
		.get('/group/getGroupInfoById', checkToken, groupController.GetGroupInfoById)
		.get('/group/getGroupSectionsById', checkToken, groupController.GetGroupSectionsById)
}