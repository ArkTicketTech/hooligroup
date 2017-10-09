// Get Token
const jwt = require('jsonwebtoken')
module.exports = function (req, res) {
	let token = req.headers['authorization'].split(' ')[1]
	// 解构 token，生成一个对象 { name: xx, iat: xx, exp: xx }
	let decoded = jwt.decode(token, 'secret')
	// console.log(decoded.exp)
	// console.log(Date.now() / 1000)
	// 监测 token 是否过期
	if(token && decoded.exp <= Date.now() / 1000) {
		return res.send(401, 'token过期，请重新登录')
	}
	
	return decoded;
}
