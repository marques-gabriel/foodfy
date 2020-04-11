
//  === CLICK RECEITA ===

const products = document.querySelectorAll('.option-container')

for (let productIndex = 0; products.length; productIndex++) {
    products[productIndex].addEventListener("click", function() {
        window.location.href = `/recipe/${productIndex}`
    })
}

// === MOSTRAR/ESCONDER ===

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

    

   