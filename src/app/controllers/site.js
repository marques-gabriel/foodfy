const Recipe = require ('../models/Recipe')
const Chef = require ('../models/Chef')

module.exports = {

    index(req, res) {
        const home = {
            title: "As melhores receitas",
            text: "Aprenda a construir os melhores pratos com receitas criadas por profissionais do mundo inteiro.",
            img: "/chef.png",
            subTitle: "Mais Acessadas"
    
        }

        Recipe.all(function(recipes) {
            return res.render("site/home", {home, items: recipes})
            
        })
    },

    recipes(req, res) {

        Recipe.all(function(recipes) {
            return res.render("site/recipes", { items: recipes})
            
        })
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

    recipe(req, res) {
        Recipe.find(req.params.id, function(recipe) {
            if (!recipe) return res.send("Recipe not found")
            
            const titles = {
                ingredients: "Ingredientes",
                preparation: "Modo de Preparo",
                information: "Informações Adiconais"
        
            }
            
            return res.render("site/recipe", { titles, recipe })
        })
    },

    chefs(req, res) {
        Chef.all(function(chefs) {
            return res.render("site/chefs", {chefs})
        })
    }
}