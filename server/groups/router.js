const groupController = require('./controller')
const checkToken = require('../middleware/checkToken.js')

module.exports = (router) => {
	router.get('/groups', checkToken, groupController.Groups)
		.post('/group/create', checkToken, groupController.Create)
		.get('/group/getGroupInfoById', checkToken, groupController.GetGroupInfoById)
		.get('/group/getGroupSectionsById', checkToken, groupController.GetGroupSectionsById)
		.post('/group/section/new', checkToken, groupController.NewGroupSection)
		.post('/group/section/delete', checkToken, groupController.DeleteGroupSection)
}