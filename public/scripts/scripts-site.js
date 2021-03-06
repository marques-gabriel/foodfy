// Pagina ativa

const currentPage = location.pathname
const menuItems = document.querySelectorAll(".header-list li a")

for ( item of menuItems) {
    if (currentPage.includes(item.getAttribute("href"))) {
        item.classList.add("active")
    }
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

//Information
const infoBottom = document.querySelector('.info-bottom')
const information = document.querySelector('.information')

infoBottom.addEventListener("click", function() {
    information.classList.toggle('desactive')

    if (information.classList.contains('desactive')) {
        infoBottom.innerHTML = "MOSTRAR"

    } else {
        infoBottom.innerHTML = "ESCONDER"
    }
})




    
