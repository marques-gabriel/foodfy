const Chef = require ('../models/Chef')
const File = require('../models/File')
const Recipe = require ('../models/Recipe')

module.exports = {
    async index(req, res) {

        const chefs = await Chef.all()

        let files = []

        for (chef of chefs) {
            let results = await Chef.files(chef.file_id)
            files.push(results.rows[0])
        }

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("admin/chefs/index", {chefs, files})
    },

    create(req, res) {
        return res.render("admin/chefs/create")

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

        const file = await File.create(req.files[0])
        
        const chefData = {
            ...req.body,
            file_id: file.rows[0].id
        }

        let results = await Chef.create(chefData)
        const chefId = results.rows[0].id
        
        return res.redirect(`/admin/chefs/${chefId}`)


    },

    async show(req, res) {

        let results = await Chef.find(req.params.id)

        const chef = results.rows[0]
        if (!chef) return res.send("Chef not found")

        results = await Chef.files(chef.file_id)
        let fileChef = results.rows[0]

        fileChef = {
            ...fileChef,
            src: `${req.protocol}://${req.headers.host}${fileChef.path.replace("public", "")}`
        }

        results = await Chef.findRecipes(req.params.id)
        const recipes = results.rows

        let filesRecipes = []

        for (recipe of results.rows) {
            let resultsFiles = await Recipe.files(recipe.id)
            filesRecipes.push(resultsFiles.rows[0])
        }

        filesRecipes = filesRecipes.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))
            
        return res.render("admin/chefs/show", { chef, recipes, filesRecipes, fileChef})
            

    },

    async edit(req, res) {

        let results = await Chef.find(req.params.id)

        const chef = results.rows[0]
        if (!chef) return res.send("Chef not found")

        results = await Chef.files(chef.file_id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))
        
        return res.render("admin/chefs/edit", { chef, files })
    },

    async put(req, res) {

        //validacao
        const keys = Object.keys(req.body)
        for(key of keys) {
            if (req.body[key] == "" && key != "removed_files")
                return res.send("Por favor, preencha todos os campos!")
        }
        
        const file = await File.create(req.files[0])

        const chefData = {
            ...req.body,
            file_id: file.rows[0].id
        }

        await Chef.update(chefData)

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)

            const removedFilesPromise = removedFiles.map(id => File.delete(id))

            await Promise.all(removedFilesPromise)
        }
        
        return res.redirect(`/admin/chefs/${req.body.id}`)
    },

    async delete(req, res) {

        let results = await Chef.find(req.body.id)

        const chef = results.rows[0]
            if (!chef) return res.send("Chef not found")

        results = await Chef.files(chef.file_id)
        let files = results.rows

        await Chef.delete(req.body.id, files)

        //Chefs que possuem receitas não podem ser deletados.
        return res.redirect("/admin/chefs")
    }
}