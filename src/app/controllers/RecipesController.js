const Recipe = require ('../models/Recipe')
const File = require('../models/File')
const User = require('../models/User')
const RecipeFiles = require('../models/Recipe_Files')

const LoadRecipesService = require('../services/LoadRecipesService')



module.exports = {
    async index(req, res) {

        try {

            const userId = req.session.userId
            const user =  await User.findOne({ where: { id: userId }})

            let recipes

            if(user.is_admin == true) {

                recipes = await LoadRecipesService.load('Recipes', '')

            } else {

                recipes = await LoadRecipesService.load('RecipesUsers', req.session.userId)
            }

            if (recipes == 0) return res.render("admin/recipes/index",{ 
                user,
                success: 'Não encontramos receitas cadastradas no momento'
             })

            const { success, error } = req.session

            req.session.success = ""
            req.session.error = ""
            
            return res.render("admin/recipes/index", { recipes, user, success, error })

        } catch (error) {
            console.error(error)
        }                   
    },

    async create(req, res) {

        try {
            
            let results = await Recipe.chefsSelectOptions()
            const chefs = results.rows

            return res.render("admin/recipes/create", {chefsOptions: chefs}) 

        } catch (error) {
            console.error(error)
        }
    },

    async post(req, res) {

        try {

            const recipeId = await Recipe.create({
                chef_id: req.body.chef,
                user_id: req.session.userId,
                title: req.body.title,
                ingredients: `{${req.body.ingredients}}`,
                preparation: `{${req.body.preparation}}`,
                information: req.body.information
            })

            const filesPromise = req.files.map(file => File.create({ 
                name: file.filename, 
                path: file.path 
            }))

            const filesResults = await Promise.all(filesPromise)

            const recipeFilesResults = filesResults.map((file) =>{
                RecipeFiles.create({recipe_id: recipeId, file_id: file})
            })

            await Promise.all(recipeFilesResults)


            return res.render('admin/recipes/success')

        } catch (error) {
            console.error(error)
            req.session.error = "Erro ao criar receita"
            return res.redirect("/admin/recipes")
        }
        
    },

    async show(req, res) {

        try {

            const { userId } = req.session

            const user = await User.findOne({ where: {id: userId} })

            const recipe = await LoadRecipesService.load('Recipe', req.params.id)

            const ownUser = recipe.user_id == userId ? true : false

            if (!recipe) return res.render("admin/recipes/show", {
                error: 'Receita não encontrada'
            })

            const { success, error } = req.session

            req.session.success = ""
            req.session.error = ""

            return res.render("admin/recipes/show", { recipe, ownUser, user, success, error })
            
        } catch (error) {
            console.error(error)
        }
    },

    async edit(req, res) {

        try {

            const recipe = await LoadRecipesService.load('Recipe', req.params.id)

            if (!recipe) return res.render("admin/recipes/index", {
                error: 'Receita não encontrada'
            })

            results = await Recipe.chefsSelectOptions()
            const chefs = results.rows

            return res.render("admin/recipes/edit", {recipe, chefsOptions: chefs})
            
        } catch (error) {
            console.error(error)
        }    
    },

    async put(req, res) {

        try {

            const recipeId = req.body.id

            if (req.files.length != 0) {
                const newFilesPromise = req.files.map(file => File.create({
                    name: file.filename, 
                    path: file.path, 
                }))

                const newFilesResults = await Promise.all(newFilesPromise)

                const NewrecipeFilesResults = newFilesResults.map((file) =>{
                    RecipeFiles.create({recipe_id: recipeId, file_id: file})
                })

                await Promise.all(NewrecipeFilesResults)
            
            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)


                const removedRecipeFilesPromise = removedFiles.map(id => RecipeFiles.delete(id))
                await Promise.all(removedRecipeFilesPromise)
                
                const removedFilesPromise = removedFiles.map(id => File.delete(id))
                await Promise.all(removedFilesPromise)

            }

            await Recipe.update(recipeId, {
                chef_id: req.body.chef,
                title: req.body.title,
                ingredients: `{${req.body.ingredients}}`,
                preparation: `{${req.body.preparation}}`,
                information: req.body.information,
            
            })

            req.session.success = "Receita atualizada com sucesso"

            return res.redirect(`/admin/recipes/${recipeId}`)
            
        } catch (error) {
            console.error(error)

            req.session.error = "Erro ao atualizar receita"
            return res.redirect(`/admin/recipes`)

        }    
    },

    async delete(req, res) {

        try {

            await Recipe.delete(req.body.id)

            req.session.success = "Receita deletada com sucesso"
        
            return res.redirect("/admin/recipes")
            
        } catch (error) {
            console.error(error)
            req.session.error = "Erro ao deletar receita"
            return res.redirect("/admin/recipes")

        }       
    }
}