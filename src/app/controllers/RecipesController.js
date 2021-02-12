const Recipe = require ('../models/Recipe')
const File = require('../models/File')
const RecipeFiles = require('../models/Recipe_Files')


module.exports = {
    async index(req, res) {

        try {

            let { filter, page, limit } = req.query
            page = page || 1
            limit = limit || 6
            let offset = limit * (page - 1)

            const params = {
                filter,
                page,
                limit,
                offset
            }

            let recipes = await Recipe.paginate(params)

            if (recipes == 0) return res.render("admin/recipes/index",{ 
                filter,
                success: 'Não encontramos receitas cadastradas no momento'
             })

            const pagination = {
                total: Math.ceil (recipes[0].total / limit),
                page
            }

            async function getImage(recipeId) {
                let results = await Recipe.files(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)
    
                return files[0]
            }

            const recipesPromise = recipes.map(async recipe => {
                recipe.img = await getImage(recipe.id)
                return recipe
            })

            recipes = await Promise.all(recipesPromise)
            
            return res.render("admin/recipes/index", { recipes, pagination, filter })

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

            return res.redirect(`/admin/recipes/${recipeId}`)
            
        } catch (error) {
            console.error(error)
        }
        
    },

    async show(req, res) {

        try {

            let results = await Recipe.find(req.params.id)

            const recipe = results.rows[0]
            if (!recipe) return res.render("admin/recipes/index", {
                error: 'Receita não encontrada'
            })

            const titles = {
                ingredients: "Ingredientes",
                preparation: "Modo de Preparo",
                information: "Informações Adiconais"
            }

            results = await Recipe.files(recipe.id)
            const files = results.rows.map(file => ({
                ...file,
                src: `${file.path.replace("public", "")}`
            }))
            
            return res.render("admin/recipes/show", { titles, recipe, files })
            
        } catch (error) {
            console.error(error)
        }
    },

    async edit(req, res) {

        try {

            let results = await Recipe.find(req.params.id)

            const recipe = results.rows[0]
            if (!recipe) return res.render("admin/recipes/index", {
                error: 'Receita não encontrada'
            })

            results = await Recipe.chefsSelectOptions()
            const chefs = results.rows

            results = await Recipe.files(recipe.id)
            let files = results.rows
            files = files.map(file => ({
                ...file,
                src: `${file.path.replace("public", "")}`
            }))

            return res.render("admin/recipes/edit", {recipe, chefsOptions: chefs, files})
            
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
            
            return res.redirect(`/admin/recipes/${recipeId}`)
            
        } catch (error) {
            console.error(error)
        }    
    },

    async delete(req, res) {

        try {

            await Recipe.delete(req.body.id)
        
            return res.redirect("/admin/recipes")
            
        } catch (error) {
            console.error(error)
        }       
    }
}