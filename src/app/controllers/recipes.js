const Recipe = require ('../models/Recipe')
const File = require('../models/File')
const RecipeFiles = require('../models/Recipe_Files')


module.exports = {
    index(req, res) {

        let { filter, page, limit } = req.query
            page = page || 1
            limit = limit || 6
            let offset = limit * (page - 1)

            const params = {
                filter,
                page,
                limit,
                offset,
                callback(recipes) {
                    if(recipes) {
                        const pagination = {
                            total: Math.ceil (recipes[0].total / limit),
                            page
                        }

                        return res.render("admin/recipes/index",{ recipes, pagination,filter} )

                    } else {
                        return res.send("Não há receitas cadastradas")
                    }
                }
            }

            Recipe.paginate(params)
    },

    async create(req, res) {

        let results = await Recipe.chefsSelectOptions()
        const chefs = results.rows

        return res.render("admin/recipes/create", {chefsOptions: chefs}) 

    },

    async post(req, res) {

        //validacao
        const keys = Object.keys(req.body)
        for(key of keys) {
            if (req.body[key] == "")
                return res.send("Por favor, preencha todos os campos!")
        }

        if (req.files.length == 0)
            return res.send("Please, send at least one image")

        let results = await Recipe.create(req.body)
        const recipeId = results.rows[0].id

        const filesPromise = req.files.map(file => File.create({
            ...file
         }))

        const filesResults = await Promise.all(filesPromise)

        const recipeFilesResults = filesResults.map((file) =>{

            const fileId = file.rows[0].id
            RecipeFiles.create(recipeId, fileId)
        })

        await Promise.all(recipeFilesResults)

        return res.redirect(`/admin/recipes/${recipeId}`)
        
    },

    async show(req, res) {
    
        let results = await Recipe.find(req.params.id)

        const recipe = results.rows[0]
        if (!recipe) return res.send("Recipe not found")

        const titles = {
            ingredients: "Ingredientes",
            preparation: "Modo de Preparo",
            information: "Informações Adiconais"
    
        }

        results = await Recipe.files(recipe.id)
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))
        
        return res.render("admin/recipes/show", { titles, recipe, files })

    },

    async edit(req, res) {

        let results = await Recipe.find(req.params.id)

        const recipe = results.rows[0]
        if (!recipe) return res.send("Recipe not found")

        results = await Recipe.chefsSelectOptions()
        const chefs = results.rows

        results = await Recipe.files(recipe.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("admin/recipes/edit", {recipe, chefsOptions: chefs, files})
    
    },

    async put(req, res) {

        //validacao
        const keys = Object.keys(req.body)
        for(key of keys) {
            if (req.body[key] == "" && key != "removed_files")
                return res.send("Por favor, preencha todos os campos!")
        }

        if (req.files.length != 0) {
            const newFilesPromise = req.files.map(file => 
            File.create({...file}))

            const newFilesResults = await Promise.all(newFilesPromise)

            const NewrecipeFilesResults = newFilesResults.map((file) =>{
                const fileId = file.rows[0].id
                RecipeFiles.create(req.body.id, fileId)
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


        await Recipe.update(req.body)
        
        return res.redirect(`/admin/recipes/${req.body.id}`)
        
    },

    async delete(req, res) {
        
        await Recipe.delete(req.body.id)
        
        return res.redirect("/admin/recipes")
    }
}