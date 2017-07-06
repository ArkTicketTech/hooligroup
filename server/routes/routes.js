const express = require('express')
const UserController = require('../controller/user.js')
const GroupController = require('../controller/group.js')
const router = express.Router()

UserController(router)
GroupController(router)

module.exports = router
