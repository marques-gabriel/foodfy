const express = require('express')
const routes = express.Router()
const site = require('./app/controllers/site')
const recipes = require('./app/controllers/recipes')
const chefs = require('./app/controllers/chefs')



routes.get('/', function(req, res) {
    return res.redirect("home")
})

routes.get('/admin', function(req, res) {
    return res.redirect("/admin/recipes")
})

// ==== SITE ====//

routes.get("/home", site.index)
routes.get("/recipes", site.recipes)
routes.get("/about", site.about)
routes.get("/recipe/:id", site.recipe)
routes.get("/chefs", site.chefs)
routes.get("/search", site.search)


// ==== ADMIN ====//

// RECIPES

routes.get("/admin/recipes", recipes.index)
routes.get("/admin/recipes/create", recipes.create)
routes.get("/admin/recipes/:id", recipes.show)
routes.get("/admin/recipes/:id/edit", recipes.edit)

routes.post("/admin/recipes", recipes.post)
routes.put("/admin/recipes", recipes.put)
routes.delete("/admin/recipes", recipes.delete)

// CHEFS

routes.get("/admin/chefs", chefs.index)
routes.get("/admin/chefs/create", chefs.create)
routes.get("/admin/chefs/:id", chefs.show)
routes.get("/admin/chefs/:id/edit", chefs.edit)

routes.post("/admin/chefs", chefs.post)
routes.put("/admin/chefs", chefs.put)
routes.delete("/admin/chefs", chefs.delete)





module.exports = routes