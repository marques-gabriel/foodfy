
//  === CLICK RECIPE ===

const recipes = document.querySelectorAll('.recipe-container')

for (let recipeIndex = 0; recipes.length; recipeIndex++) {
    recipes[recipeIndex].addEventListener("click", function() {
        window.location.href = `/recipe/${recipeIndex}`
    })
}

// === MOSTRAR/ESCONDER ===


//Ingredients
const ingredientsBottom = document.querySelector('.ingredients-bottom')
const ingredientsList = document.querySelector('.ingredients-list')

ingredientsBottom.addEventListener("click", function() {
    ingredientsList.classList.toggle('desactive')

    if (ingredientsList.classList.contains('desactive')) {
       ingredientsBottom.innerHTML = "MOSTRAR"
    } else {
       ingredientsBottom.innerHTML = "ESCONDER"
    }

})

//Preparation
const preparationBottom = document.querySelector('.preparation-bottom')
const preparationList = document.querySelector('.preparation-list')

  
preparationBottom.addEventListener("click", function() {
    preparationList.classList.toggle('desactive')

    if (preparationList.classList.contains('desactive')) {
        preparationBottom.innerHTML = "MOSTRAR"
    } else {
        preparationBottom.innerHTML = "ESCONDER"
    }

})

    

   