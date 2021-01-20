const Recipe = require ('../models/Recipe')
const Chef = require ('../models/Chef')

module.exports = {

    async index(req, res) {

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

            const recipes = await Recipe.paginate(params)

            const pagination = {
                total: Math.ceil (recipes[0].total / limit),
                page
            }
            let files = []

            for (recipe of recipes) {
                let results = await Recipe.files(recipe.id)
                files.push(results.rows[0])
            }

            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            const home = {
                title: "As melhores receitas",
                text: "Aprenda a construir os melhores pratos com receitas criadas por profissionais do mundo inteiro.",
                img: "images/chef.png",
                subTitle: "Mais Acessadas"
            }
            
            return res.render("site/home",{home, items: recipes, pagination,filter, files} )

    },

    async recipes(req, res) {

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

            const recipes = await Recipe.paginate(params)

            const pagination = {
                total: Math.ceil (recipes[0].total / limit),
                page
            }
            let files = []

            for (recipe of recipes) {
                let results = await Recipe.files(recipe.id)
                files.push(results.rows[0])
            }

            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))
            
            return res.render("site/recipes",{ items: recipes, pagination,filter, files} )


    },

    about(req, res) {
        const about = {
            title1: "Sobre o Foodfy",
            title2: "Como tudo começou…",
            title3: "Nossas receitas",
            p1: "Suspendisse placerat neque neque. Morbi dictum nulla non sapien rhoncus, et mattis erat commodo. Aliquam vel lacus a justo mollis luctus. Proin vel auctor eros, sed eleifend nunc. Curabitur eget tincidunt risus. Mauris malesuada facilisis magna, vitae volutpat sapien tristique eu. Morbi metus nunc, interdum in erat placerat, aliquam iaculis massa. Duis vulputate varius justo pharetra maximus. In vehicula enim nec nibh porta tincidunt. Vestibulum at ultrices turpis, non dictum metus. Vivamus ligula ex, semper vitae eros ut, euismod convallis augue.",
            p2: "Fusce nec pulvinar nunc. Duis porttitor tincidunt accumsan. Quisque pulvinar mollis ipsum ut accumsan. Proin ligula lectus, rutrum vel nisl quis, efficitur porttitor nisl. Morbi ut accumsan felis, eu ultrices lacus. Integer in tincidunt arcu, et posuere ligula. Morbi cursus facilisis feugiat. Praesent euismod nec nisl at accumsan. Donec libero neque, vulputate semper orci et, malesuada sodales eros. Nunc ut nulla faucibus enim ultricies euismod." 
        }
    
        return res.render("site/about", {about})
    },

    async recipe(req, res) {

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
        
            
        return res.render("site/recipe", { titles, recipe, files })
    },

    async chefs(req, res) {
        
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

        return res.render("site/chefs", {chefs, files})
    },

    async search(req, res) {


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

        const recipes = await Recipe.paginate(params)

        if(recipes == 0) 
            return res.render("site/search",{ filter } )

        let files = []

            for (recipe of recipes) {
                let results = await Recipe.files(recipe.id)
                files.push(results.rows[0])
            }

            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            const pagination = {
                total: Math.ceil (recipes[0].total / limit),
                page
            }
            return res.render("site/search",{items: recipes, pagination,filter, files} )

    }
}