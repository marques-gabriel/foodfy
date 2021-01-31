const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')


// login/logout
routes.get('/login', SessionController.loginForm)



module.exports = routes
