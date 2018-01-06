const express = require('express')
const router = express.Router()
const userRouter = require('../users/router.js')
const groupRouter = require('../groups/router.js')
const voteRouter = require('../vote/router.js')
const eventRouter = require('../events/router.js')

userRouter(router)
groupRouter(router)
voteRouter(router)
eventRouter(router)

module.exports = router