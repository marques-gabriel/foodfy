const express = require('express')
const routes = express.Router()

const ProfileValidator = require('../app/validators/profileValidator')
const ProfileController = require('../app/controllers/ProfileController')

const { onlyUsers } = require('../app/middlewares/session')




// Rotas de perfil de um usuário logado
routes.get('/', onlyUsers, ProfileValidator.show, ProfileController.index)
routes.put('/', onlyUsers, ProfileValidator.put, ProfileController.put)

module.exports = routes
