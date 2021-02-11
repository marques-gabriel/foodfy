const Recipe = require ('../models/Recipe')
const Chef = require ('../models/Chef')

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

            const home = {
                title: "As melhores receitas",
                text: "Aprenda a construir os melhores pratos com receitas criadas por profissionais do mundo inteiro.",
                img: "images/chef.png",
                subTitle: "Mais Acessadas"
            }

            let recipes = await Recipe.paginate(params)

            if (recipes == 0) return res.render("site/home",{ 
                home,
                filter,
                error: 'Não encontramos receitas cadastradas no momento'
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

            return res.render("site/home",{home, items: recipes, pagination,filter} )
            
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

            let recipes = await Recipe.paginate(params)

            if (recipes == 0) return res.render("site/recipes",{ 
                filter,
                error: 'Não encontramos receitas com esse termo'
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
            
            return res.render("site/recipes",{ items: recipes, pagination,filter} )

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

            let results = await Recipe.find(req.params.id)
            const recipe = results.rows[0]

            if (!recipe) return res.render("site/home", {
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
            
                
            return res.render("site/recipe", { titles, recipe, files })
            
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

            let recipes = await Recipe.paginate(params)

            if(recipes == 0) 
                return res.render("site/search",{ filter } )

            if (recipes == 0) return res.render("site/search", {
                filter,
                error: 'Não encontramos receitas com esse termo'
            })

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

            const pagination = {
                total: Math.ceil (recipes[0].total / limit),
                page
            }

            return res.render("site/search",{items: recipes, pagination,filter} )

        } catch (error) {
            console.erro(error)
        }
    }
}