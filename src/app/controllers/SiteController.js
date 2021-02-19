const Chef = require ('../models/Chef')
const LoadRecipesService = require('../services/LoadRecipesService')

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

            let recipes = await LoadRecipesService.load('RecipesParams', params)

            if (recipes == 0) return res.render("site/home",{ 
                filter,
                error: 'Não encontramos receitas cadastradas no momento'
             })

            const pagination = {
                total: Math.ceil (recipes[0].total / limit),
                page
            }

            return res.render("site/home",{ items: recipes, pagination, filter} )
            
        } catch (error) {
            console.error(error)
        }
    },

    async recipes(req, res) {

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

            let recipes = await LoadRecipesService.load('RecipesParams', params)
            
            if (recipes == 0) return res.render("site/recipes",{ 
                filter,
                error: 'Não encontramos receitas com esse termo'
             })


            const pagination = {
                total: Math.ceil (recipes[0].total / limit),
                page
            }
            
            return res.render("site/recipes",{ items: recipes, pagination, filter} )

        } catch (error) {
            console.error(error)
        }

    },

    about(req, res) {
        try {

            const about = {
                title1: "Sobre o Foodfy",
                title2: "Como tudo começou…",
                title3: "Nossas receitas",
                p1: "Suspendisse placerat neque neque. Morbi dictum nulla non sapien rhoncus, et mattis erat commodo. Aliquam vel lacus a justo mollis luctus. Proin vel auctor eros, sed eleifend nunc. Curabitur eget tincidunt risus. Mauris malesuada facilisis magna, vitae volutpat sapien tristique eu. Morbi metus nunc, interdum in erat placerat, aliquam iaculis massa. Duis vulputate varius justo pharetra maximus. In vehicula enim nec nibh porta tincidunt. Vestibulum at ultrices turpis, non dictum metus. Vivamus ligula ex, semper vitae eros ut, euismod convallis augue.",
                p2: "Fusce nec pulvinar nunc. Duis porttitor tincidunt accumsan. Quisque pulvinar mollis ipsum ut accumsan. Proin ligula lectus, rutrum vel nisl quis, efficitur porttitor nisl. Morbi ut accumsan felis, eu ultrices lacus. Integer in tincidunt arcu, et posuere ligula. Morbi cursus facilisis feugiat. Praesent euismod nec nisl at accumsan. Donec libero neque, vulputate semper orci et, malesuada sodales eros. Nunc ut nulla faucibus enim ultricies euismod." 
            }
        
            return res.render("site/about", { about })
            
        } catch (error) {
            console.error(error)
        }
    },

    async recipe(req, res) {

        try {

            const recipe = await LoadRecipesService.load('Recipe', req.params.id)

            if (!recipe) return res.render("site/recipe", {
                error: 'Receita não encontrada'
            })
                
            return res.render("site/recipe", { recipe })
            
        } catch (error) {
            console.error(error)
        }
    },

    async chefs(req, res) {

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

        return res.render("site/chefs", {chefs})
            
        } catch (error) {
            console.erro(error)
        }
    },

    async search(req, res) {
        
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

            let recipes = await LoadRecipesService.load('RecipesParams', params)

            if (recipes == 0) return res.render("site/search", {
                filter,
                error: 'Não encontramos receitas com esse termo'
            })

            const pagination = {
                total: Math.ceil (recipes[0].total / limit),
                page
            }

            return res.render("site/search",{items: recipes, pagination, filter} )

        } catch (error) {
            console.erro(error)
        }
    }
}