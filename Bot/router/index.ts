const Router = require('express')
const router = new Router()
const administratorRouter = require('./administratorRouter')

router.use('/user', administratorRouter)

module.exports = router