const Chef = require ('../models/Chef')
const File = require('../models/File')
const User = require ('../models/User')

const LoadChefsService = require('../services/LoadChefsService')


module.exports = {
    async index(req, res) {

        try {

            const chefs = await LoadChefsService.load('Chefs', '')

            const { userId: id } = req.session
            const user = await User.findOne({ where: {id} })

            if (chefs == 0) return res.render("admin/chefs/index",{ 
                user,
                success: 'Não encontramos chefes cadastrados no momento'
             })

            const { success, error } = req.session

            req.session.success = ""
            req.session.error = ""

            return res.render("admin/chefs/index", {chefs, user, success, error})
            
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

        return res.render('admin/chefs/success')

            
        } catch (error) {
            console.error(error)
            req.session.error = "Erro ao criar chefe"
            return res.redirect("/admin/chefs")
        }

    },

    async show(req, res) {

        try {

            const chef = await LoadChefsService.load('Chef', req.params.id)

            const { userId: id } = req.session
            const user = await User.findOne({ where: {id} })

            if (!chef) return res.render("admin/chefs/index", {
                error: 'Chefe não encontrado'
            })

            const recipes = await LoadChefsService.load('ChefsRecipes', req.params.id)

            const { success, error } = req.session

            req.session.success = ""
            req.session.error = ""

            return res.render("admin/chefs/show", { chef, recipes, user, success, error})
            
        } catch (error) {
            console.error(error)
        }    
    },

    async edit(req, res) {

        try {

            const chef = await LoadChefsService.load('Chef', req.params.id)

            if (!chef) return res.render("admin/chefs/index", {
                error: 'Chefe não encontrado'
            })
            
            return res.render("admin/chefs/edit", { chef })

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

                const chef = await LoadChefsService.load('Chef', chefId)

                await Chef.update(chefId, {
                    name: req.body.name,
                    file_id: chef.files[0].id
                })
            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                const removedFilesPromise = removedFiles.map(id => File.delete(id))

                await Promise.all(removedFilesPromise)
            }

            req.session.success = "Chefe atualizado com sucesso"
            
            return res.redirect(`/admin/chefs/${chefId}`)

        } catch (error) {
            console.error(error)
            req.session.error = "Erro ao atualizar chefe"
            return res.redirect("/admin/chefs")
        }
    },

    async delete(req, res) {

        try {

            const chef = await LoadChefsService.load('Chef', req.body.id)

            await Chef.delete(req.body.id, chef.files)

            req.session.success = "Chefe deletado com sucesso"

            //Chefs que possuem receitas não podem ser deletados.
            return res.redirect("/admin/chefs")
            
        } catch (error) {
            console.error(error)
            req.session.error = "Erro ao deletar chefe"
            return res.redirect("/admin/chefs")

        }
    }
}