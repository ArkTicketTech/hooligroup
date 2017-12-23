const userController = require('./controller')
const checkToken = require('../middleware/checkToken.js')

module.exports = (router) => {
	router.post('/register', userController.Register),
		router.post('/login', userController.Login),
		router.get('/user', checkToken, userController.User),
		router.post('/delUser', checkToken, userController.DelUser),
		router.post('/joinGroup', checkToken, userController.JoinGroup)
}