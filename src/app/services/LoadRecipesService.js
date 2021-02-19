const Recipe = require('../models/Recipe')

async function getImages(recipeId) {
    let results = await Recipe.files(recipeId)
    const files = results.rows.map(file => ({
        ...file,
        src: `${file.path.replace("public", "")}`
    }))

    return files
}

async function format(recipe) {
    
    const files = await getImages(recipe.id)
    recipe.img = files[0].src
    recipe.files = files

   return recipe

}

const LoadService = {

    load(service, filter) {
        this.filter = filter
        return this[service]()
    },

    async Recipe(){
        try {

            const recipe = await Recipe.find( this.filter )
            return format(recipe.rows[0])
            
        } catch (error) {
            console.error(error)
        }
    },

    async Recipes(){
        try {

            const recipes = await Recipe.all(this.filter)
            const recipesPromise = recipes.map(format)

            return Promise.all(recipesPromise)
            
        } catch (error) {
            console.error(error)
        }
    },

    async RecipesParams(){
        try {

            const recipes = await Recipe.paginate(this.filter)
            const recipesPromise = recipes.map(format)

            return Promise.all(recipesPromise)
            
        } catch (error) {
            console.error(error)
        }
    },

    async RecipesUsers(){
        try {

            const recipes = await Recipe.findRecipesByUsers(this.filter)
            const recipesPromise = recipes.map(format)

            return Promise.all(recipesPromise)
            
        } catch (error) {
            console.error(error)
        }
    },



    format,

}


module.exports = LoadService