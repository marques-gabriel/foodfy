const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')
const ProfileController = require('../app/controllers/ProfileController')

const UserValidator = require('../app/validators/userValidator')
const SessionValidator = require('../app/validators/sessionValidator')
const ProfileValidator = require('../app/validators/profileValidator')


// login/logout
routes.get('/login', SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)



// reset password / forgot
routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)


// Rotas de perfil de um usuário logado
routes.get('/profile', ProfileValidator.show, ProfileController.index)
routes.put('/profile', ProfileValidator.put, ProfileController.put)


// users 
routes.get('/register', UserController.registerForm)
routes.get('/:id/edit', UserValidator.edit, UserController.edit)
routes.get('/', UserController.list)

routes.post('/register', UserValidator.post, UserController.post)
routes.put('/', UserValidator.put, UserController.put)
routes.delete('/', UserController.delete)


module.exports = routes
