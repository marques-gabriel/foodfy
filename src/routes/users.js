const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')

const UserValidator = require('../app/validators/userValidator')
const SessionValidator = require('../app/validators/sessionValidator')

const { onlyUsers, onlyAdmin, isLoggedRedirectToProfile } = require('../app/middlewares/session')



// login/logout
routes.get('/login', isLoggedRedirectToProfile, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)



// reset password / forgot
routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)


// users 
routes.get('/register', onlyUsers, onlyAdmin, UserController.registerForm)
routes.get('/:id/edit', onlyUsers, onlyAdmin, UserValidator.edit, UserController.edit)
routes.get('/', onlyUsers, onlyAdmin, UserController.list)

routes.post('/register', onlyUsers, onlyAdmin, UserValidator.post, UserController.post)
routes.put('/', onlyUsers, onlyAdmin, UserValidator.put, UserController.put)
routes.delete('/', onlyUsers, onlyAdmin, UserValidator.deleteUser, UserController.delete)


module.exports = routes
