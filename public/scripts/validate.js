const Validate = {
    apply(input, func) {

        Validate.clearErrors(input)

        let results = Validate[func](input.value) 
        input.value = results.value

        if (results.error)
            Validate.displayError(input, results.error)
        
    },

    displayError(input, error) {

        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = error
        input.parentNode.appendChild(div)
        input.focus()
    },

    clearErrors(input) {
        const errorDiv = input.parentNode.querySelector(".error")
        if(errorDiv) 
            errorDiv.remove()
    },

    isEmail(value) {
        let error = null

        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!value.match(mailFormat))
            error = "Email inválido"

        return {
            error,
            value
        }
    },

    allFields(e) {
        const items = document.querySelectorAll(' .item input, .item select, .item textarea, .ingredient input, .preparation input')


        for (item of items) {
            if (item.value == "") {

                const message = document.createElement('div')
                message.classList.add('messages')
                message.classList.add('error')
                message.style.position = "fixed"
                message.innerHTML = "Todos os campos são obrigatórios."
                document.querySelector('body').append(message)

                item.parentNode.style.border = '1px solid #DC4747'

                e.preventDefault()
            }
        }
    }
}