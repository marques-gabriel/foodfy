const express = require('express')
const routes = express.Router()
const site = require('./controllers/site')
const admin = require('./controllers/admin')


routes.get('/', function(req, res) {
    return res.redirect("home")
})

routes.get('/admin', function(req, res) {
    return res.redirect("/admin/recipes")
})

// SITE

routes.get("/home", site.index)
routes.get("/recipes", site.recipes)
routes.get("/about", site.about)
routes.get("/recipe/:index", site.recipe)

// ==== ADMIN ====//

// RECIPES

routes.get("/admin/recipes/create", admin.create)
routes.get("/admin/recipes/:index", admin.show)
routes.get("/admin/recipes/:index/edit", admin.edit)
routes.get("/admin/recipes", admin.index)

routes.post("/admin/recipes", admin.post)
routes.put("/admin/recipes", admin.put)
routes.delete("/admin/recipes", admin.delete)

// CHEFS





module.exports = routes