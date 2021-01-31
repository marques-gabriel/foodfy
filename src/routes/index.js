const express = require('express')
const routes = express.Router()

const site = require('./site')
const recipes = require('./recipes')
const chefs = require('./chefs')

const users = require('./users')


routes.use('/', site)
routes.use('/admin/recipes', recipes)
routes.use('/admin/chefs', chefs)

routes.use('/admin/users', users)



// Alias
routes.get('/', function(req, res) {
    return res.redirect("home")
})

routes.get('/admin', function(req, res) {
    return res.redirect("/admin/recipes")
})

module.exports = routes