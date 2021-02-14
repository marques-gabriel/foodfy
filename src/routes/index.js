const express = require('express')
const routes = express.Router()

const site = require('./site')
const recipes = require('./recipes')
const chefs = require('./chefs')
const users = require('./users')
const profile = require('./profile')

const { onlyUsers } = require('../app/middlewares/session')

routes.use('/', site)
routes.use('/admin/recipes', onlyUsers, recipes)
routes.use('/admin/chefs', onlyUsers, chefs)
routes.use('/admin/users', users)
routes.use('/admin/profile', profile)



// Alias
routes.get('/', function(req, res) {
    return res.redirect("home")
})

routes.get('/admin', function(req, res) {
    return res.redirect("/admin/recipes")
})

module.exports = routes