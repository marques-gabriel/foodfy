const Chef = require('../models/Chef')
const LoadRecipesService = require('../services/LoadRecipesService')


async function getImages(chefId) {
    let results = await Chef.files(chefId)
    const files = results.rows.map(file => ({
        ...file,
        src: `${file.path.replace("public", "")}`
    }))

    return files
}

async function format(chef) {
    
    const files = await getImages(chef.id)
    chef.img = files[0].src
    chef.files = files

   return chef

}

const LoadService = {

    load(service, filter) {
        this.filter = filter
        return this[service]()
    },

    async Chef(){
        try {

            const chef = await Chef.find( this.filter )
            return format(chef.rows[0])
            
        } catch (error) {
            console.error(error)
        }
    },

    async Chefs(){
        try {

            const chefs = await Chef.all(this.filter)
            const chefsPromise = chefs.map(format)

            return Promise.all(chefsPromise)
            
        } catch (error) {
            console.error(error)
        }
    },

    async ChefsRecipes(){
        try {

            const recipes = await Chef.findRecipes(this.filter)
            const recipesPromise = recipes.rows.map(async recipe => await LoadRecipesService.format(recipe))

            return Promise.all(recipesPromise)
            
        } catch (error) {
            console.error(error)
        }
    },

    format,

}


module.exports = LoadService