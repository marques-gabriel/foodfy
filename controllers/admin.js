const fs = require('fs')
const recipesData = require('../data.json')

exports.index = function(req, res) {
    return res.render("admin/index", {recipes: recipesData.recipes})
}

exports.create = function(req, res) {



    return res.render("admin/create")
}

exports.show = function(req, res) {

    const recipeIndex = req.params.index
    const recipe = recipesData.recipes[recipeIndex]

    if (!recipe) return res.send('Recipe not found')

    const titles = {
        ingredients: "Ingredientes",
        preparation: "Modo de Preparo",
        information: "Informações Adiconais"

    }
    
    return res.render("admin/show", {titles, recipe, recipeIndex})
    
}

exports.edit = function(req, res) {

    const recipeIndex = req.params.index
    const recipe = recipesData.recipes[recipeIndex]

    if (!recipe) return res.send('Recipe not found')

    return res.render("admin/edit", {recipe, recipeIndex})
}

exports.post = function(req, res) {


    recipesData.recipes.push(req.body)

    fs.writeFile("data.json", JSON.stringify(recipesData, null, 2), function(err) {
        if (err) return res.send("Write file error!")
        return res.redirect("/admin/recipes")
    })
}

exports.put = function(req, res) {

    const { recipeIndex } = req.body
    
    const recipe = {
        ...recipesData.recipes[recipeIndex],
        ...req.body
    }
    recipesData.recipes[recipeIndex] = recipe

    fs.writeFile("data.json", JSON.stringify(recipesData, null, 2), function(err) {
        if(err) return res.send("Write error!")

        return res.redirect(`/admin/recipes/${recipeIndex}`)
    })
}

exports.delete = function(req,res) {

    const { recipeIndex } = req.body

    const recipe = {
        ...req.body
    }
    recipesData.recipes[recipeIndex] = recipe

    const filteredRecipes = recipesData.recipes.filter(function(recipe) {
        return recipe.recipeIndex != recipeIndex
    })

    recipesData.recipes = filteredRecipes

    fs.writeFile("data.json", JSON.stringify(recipesData, null, 2), function(err) {
        if (err)
           return res.send("Write file erro")

       return res.redirect("/admin/recipes")
       
    })
}

