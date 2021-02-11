const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const RecipesController = require('../app/controllers/RecipesController')

const Validator = require('../app/validators/recipeValidator')


// RECIPES

routes.get("/", RecipesController.index)
routes.get("/create", RecipesController.create)
routes.get("/:id", RecipesController.show)
routes.get("/:id/edit", RecipesController.edit)

routes.post("/", multer.array("photos", 5), Validator.post, RecipesController.post)
routes.put("/", multer.array("photos", 5), Validator.put, RecipesController.put)
routes.delete("/", RecipesController.delete)

module.exports = routes
