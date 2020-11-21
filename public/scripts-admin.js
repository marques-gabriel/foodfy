
// Visualizar receitas 

const buttonsRecipes = document.querySelectorAll('.button-visualizar')

for (let recipeIndex = 0; buttonsRecipes.length; recipeIndex++) {
    buttonsRecipes[recipeIndex].addEventListener("click", function() {
        window.location.href = `recipes/${recipeIndex}`
    })
}

// Adicionar e remover ingredientes
function addIngredient() {
    const ingredients = document.querySelector("#ingredients")
    const fieldContainer = document.querySelectorAll(".ingredient")
  
    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)
  
    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false
  
    // Deixa o valor do input vazio
    newField.children[0].value = ""
    ingredients.appendChild(newField)
}
function removeIngredient() {
    const ingredients = document.querySelector("#ingredients")
    const fieldContainer = document.querySelectorAll(".ingredient")

    if (fieldContainer.length == 1) return false
    ingredients.removeChild(fieldContainer[fieldContainer.length - 1])
}
  
  document.querySelector(".add-ingredient").addEventListener("click", addIngredient)
  document.querySelector(".remove-ingredient").addEventListener("click", removeIngredient)


// Adicionar e remover modo de preparo
function addPreparation() {
    const preparations = document.querySelector("#preparations")
    const fieldContainer = document.querySelectorAll(".preparation")
  
    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)
  
    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false
  
    // Deixa o valor do input vazio
    newField.children[0].value = ""
    preparations.appendChild(newField)
}     
function removePreparation() {
    const preparations = document.querySelector("#preparations")
    const fieldContainer = document.querySelectorAll(".preparation")

    if (fieldContainer.length == 1) return false
    preparations.removeChild(fieldContainer[fieldContainer.length - 1])
}

  document.querySelector(".add-preparation").addEventListener("click", addPreparation)
  document.querySelector(".remove-preparation").addEventListener("click", removePreparation)

  
  
