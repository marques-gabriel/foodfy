const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const ChefsController = require('../app/controllers/ChefsController')

const Validator = require('../app/validators/chefValidator')

const { onlyAdmin } = require('../app/middlewares/session')



// CHEFS

routes.get("/", ChefsController.index)
routes.get("/create", onlyAdmin, ChefsController.create)
routes.get("/:id", ChefsController.show)
routes.get("/:id/edit", onlyAdmin, ChefsController.edit)

routes.post("/", onlyAdmin, multer.array("avatar", 1), Validator.post, ChefsController.post)
routes.put("/", onlyAdmin, multer.array("avatar", 1), Validator.put, ChefsController.put)
routes.delete("/", onlyAdmin, ChefsController.delete)

module.exports = routes
