const userController = require('./controller')
const checkToken = require('../middleware/checkToken.js')

module.exports = (router) => {
	router.post('/register', userController.Register),
		router.post('/login', userController.Login),
		router.post('/login/jaccount', userController.LoginByJaccount),	
		router.get('/user', checkToken, userController.User),
		router.post('/updateUser', userController.UpdateUserInfo),
		router.post('/updatePassword', userController.UpdatePassword),
		router.post('/delUser', checkToken, userController.DelUser),
		router.post('/joinGroup', checkToken, userController.JoinGroup),
		router.post('/confirmJoinGroup', checkToken, userController.ConfirmJoinGroup),
		router.post('/leaveGroup', checkToken, userController.LeaveGroup),
		router.post('/joinEvent', checkToken, userController.JoinEvent),
		router.post('/leaveEvent', checkToken, userController.LeaveEvent)
}