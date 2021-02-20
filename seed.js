const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/User')
const Recipe = require('./src/app/models/Recipe')
const Chef = require('./src/app/models/Chef')
const RecipeFiles = require('./src/app/models/Recipe_Files')
const File = require('./src/app/models/File')

let usersIds = []

let totalUsers = 12
let totalRecipes = 30
let totalChefs = 8

async function createUsers() {
    const users = []
    const password = await hash('12345', 8)

    while (users.length < totalUsers) {

        const admin = Math.round(Math.random()) == 1 ? true : false

        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            is_admin: admin,
        })
    }

    const usersPromise = users.map(user => User.create(user))
    usersIds = await Promise.all(usersPromise)

}

async function createChefs() {

    // create files for chefs
    let files = []
  
    while (files.length < totalChefs) {

        files.push({
            name: faker.image.image(),
            path: `public/images/chefe.png`
        })
    }
  
    const filesPromise = files.map(file => File.create(file))
    filesIds = await Promise.all(filesPromise)

    // create chefs

    const chefs = []
  
    for (let i = 1; chefs.length < totalChefs; i++) {

        chefs.push({
          name: faker.name.firstName(),
          file_id: i
        })
      }

    const chefsPromise = chefs.map(chef => Chef.create(chef))
    chefsIds = await Promise.all(chefsPromise)

  }

async function createRecipes() {

    try {

    // create files for recipes
    let files = []
  
    while (files.length < totalRecipes) {

        files.push({
            name: faker.image.image(),
            path: `public/images/receita.png`
        })
    }
  
    const filesPromise = files.map(file => File.create(file))
    filesIds = await Promise.all(filesPromise)

    // create recipes
    let recipes = []

    while (recipes.length < totalRecipes) {

        recipes.push({
            chef_id: Math.ceil(Math.random() * totalChefs),
            user_id: usersIds[Math.floor(Math.random() * totalUsers)],
            title: faker.name.title(),
            ingredients: `{${faker.lorem.paragraph(1).split(" ")}}`,
            preparation: `{${faker.lorem.paragraph(1).split(" ")}}`,
            information: faker.lorem.paragraph(Math.ceil(Math.random() * 10))
        })
    }

    const recipesPromise = recipes.map(recipe => Recipe.create(recipe))
    recipesIds = await Promise.all(recipesPromise)

    // create relation recipe-files

    let recipeFiles = []
    let recipe = 1
    
    for (let i = totalChefs + 1; recipeFiles.length < totalRecipes; i++) {

        recipeFiles.push({
            recipe_id: recipe,
            file_id: i
        })

        recipe++

    }

    const recipeFilesPromise = recipeFiles.map(relation => RecipeFiles.create(relation))
    relationId = await Promise.all(recipeFilesPromise)
        
    } catch (error) {
        console.error(error)
    }

}

async function init() {
    await createUsers()
    await createChefs()
    await createRecipes()
}

init()