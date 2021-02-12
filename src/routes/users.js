const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')
const ProfileController = require('../app/controllers/ProfileController')

const UserValidator = require('../app/validators/userValidator')
const ProfileValidator = require('../app/validators/profileValidator')


// login/logout
routes.get('/login', SessionController.loginForm)

// reset password / forgot
routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)


// Rotas de perfil de um usuário logado
routes.get('/profile', ProfileValidator.show, ProfileController.index) // Mostrar o formulário com dados do usuário logado
// routes.put('/profile', ProfileValidator.put, ProfileController.put)// Editar o usuário logado


// users 
routes.get('/register', UserController.registerForm)
routes.get('/:id/edit', UserValidator.edit, UserController.edit)
routes.get('/', UserController.list)

routes.post('/register', UserValidator.post, UserController.post) //Cadastrar um usuário
routes.put('/', UserValidator.put, UserController.put) // Editar um usuário
routes.delete('/', UserController.delete) // Deletar um usuário


module.exports = routes
