const Chef = require ('../models/Chef')
const File = require('../models/File')
const Recipe = require ('../models/Recipe')

module.exports = {
    async index(req, res) {

        try {

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
            
        } catch (error) {
            console.error(error)
        }
    },

    create(req, res) {
        try {
            
            return res.render("admin/chefs/create")

        } catch (error) {
            console.error(error)
        }

    },

    async post(req, res) {

        try {

        const file = await File.create({
            name: req.files[0].filename, 
            path: req.files[0].path 
        })

        let chefId = await Chef.create({
            name: req.body.name,
            file_id: file
        })

        return res.redirect(`/admin/chefs/${chefId}`)

            
        } catch (error) {
            console.error(error)
        }

    },

    async show(req, res) {

        try {

            let results = await Chef.find(req.params.id)

            const chef = results.rows[0]
            if (!chef) return res.render("admin/chefs/index", {
                error: 'Chefe não encontrado'
            })

            results = await Chef.files(chef.file_id)
            let fileChef = results.rows[0]

            fileChef = {
                ...fileChef,
                src: `${fileChef.path.replace("public", "")}`
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
            
        } catch (error) {
            console.error(error)
        }    
    },

    async edit(req, res) {

        try {
            let results = await Chef.find(req.params.id)

            const chef = results.rows[0]
            if (!chef) return res.render("admin/chefs/index", {
                error: 'Chefe não encontrado'
            })

            results = await Chef.files(chef.file_id)
            let files = results.rows
            files = files.map(file => ({
                ...file,
                src: `${file.path.replace("public", "")}`
            }))
            
            return res.render("admin/chefs/edit", { chef, files })

        } catch (error) {
            console.error(error)
        }
    },

    async put(req, res) {

        try {

            const chefId = req.body.id
            
            if (req.files.length != 0) {

                const file = await File.create({
                    name: req.files[0].filename, 
                    path: req.files[0].path 
                })
        
                await Chef.update(chefId, {
                    name: req.body.name,
                    file_id: file
                })
            
            } else {
                let results = await Chef.find(req.body.id)
                const chef = results.rows[0]

                results = await Chef.files(chef.file_id)
                let fileId = results.rows[0].id

                await Chef.update(chefId, {
                    name: req.body.name,
                    file_id: fileId
                })
            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                const removedFilesPromise = removedFiles.map(id => File.delete(id))

                await Promise.all(removedFilesPromise)
            }
            
            return res.redirect(`/admin/chefs/${chefId}`)

        } catch (error) {
            console.error(error)
        }
    },

    async delete(req, res) {

        try {

            let results = await Chef.find(req.body.id)
            const chef = results.rows[0]

            results = await Chef.files(chef.file_id)
            let files = results.rows

            await Chef.delete(req.body.id, files)

            //Chefs que possuem receitas não podem ser deletados.
            return res.redirect("/admin/chefs")
            
        } catch (error) {
            console.error(error)
        }
    }
}