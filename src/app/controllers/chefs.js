const Chef = require ('../models/Chef')
const File = require('../models/File')
const Recipe = require ('../models/Recipe')

module.exports = {
    async index(req, res) {

        let chefs = await Chef.all()

        async function getImage(fileId) {
            let results = await Chef.files(fileId)
            const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

            return files[0]
        }

        const chefsPromise = chefs.map(async chef => {
            chef.img = await getImage(chef.file_id)
            return chef
        })

        chefs = await Promise.all(chefsPromise)

        return res.render("admin/chefs/index", {chefs})
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
        let recipes = results.rows


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

            
        return res.render("admin/chefs/show", { chef, recipes, fileChef})
            

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
        
        if (req.files.length != 0) {

            const file = await File.create(req.files[0])

            const chefData = {
                ...req.body,
                file_id: file.rows[0].id
            }
    
            await Chef.update(chefData)
           
        } else {
            let results = await Chef.find(req.body.id)
            const chef = results.rows[0]

            results = await Chef.files(chef.file_id)
            let fileId = results.rows[0].id

            const chefData = {
                ...req.body,
                file_id: fileId
            }

            await Chef.update(chefData)
        }

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