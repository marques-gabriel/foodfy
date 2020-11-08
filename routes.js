const express = require('express')
const routes = express.Router()
const site = require('./controllers/site')

routes.get('/', function(req, res) {
    return res.redirect("home")
})

// SITE

routes.get("/home", site.index)
routes.get("/recipes", site.recipes)
routes.get("/about", site.about)
routes.get("/recipe/:index", site.recipe )

// ADMIN


module.exports = routes