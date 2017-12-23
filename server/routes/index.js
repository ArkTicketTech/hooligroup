const express = require('express')
const router = express.Router()
const userRouter = require('../users/router.js')
const groupRouter = require('../groups/router.js')

userRouter(router)
groupRouter(router)

module.exports = router