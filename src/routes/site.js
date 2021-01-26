const express = require('express')
const routes = express.Router()

const site = require('../app/controllers/SiteController')

// ==== SITE ====//

routes.get("/home", site.index)
routes.get("/recipes", site.recipes)
routes.get("/about", site.about)
routes.get("/recipe/:id", site.recipe)
routes.get("/chefs", site.chefs)
routes.get("/search", site.search)

module.exports = routes
