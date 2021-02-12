const User = require('../models/User')

function checkAllFields(body) {
    const keys= Object.keys(body)

    for(key of keys) {
        if (body[key] == ""){
            return {
                user: body,
                error: 'Por favor, preencha todos os campos'
            }
        }
    }
}


async function post(req, res, next) {

        const fillAllFields = checkAllFields(req.body)
        if(fillAllFields) {
            return res.render("admin/users/register", fillAllFields)
        }

        let { email } = req.body

        const user = await User.findOne(
            {
                where: { email }
    
            })

        if (user) return res.render('admin/users/register', {
            user: req.body,
            error: 'Usuário já cadastrado'
        })

        next()
}

async function edit(req, res, next) {


    const id = req.params.id


    const user = await User.findOne({ where: {id} })


    if(!user) return res.render("admin/users/register", {
        error: "Usuário não encontrado"
    })

    req.user = user

    next()

}

async function put(req, res, next) {


    const fillAllFields = checkAllFields(req.body)
    if(fillAllFields) {
        return res.render("admin/users/index", fillAllFields)
    }

    const { id } = req.body

    const user = await User.findOne({ where: {id} })

    req.user = user

    next()

}

module.exports = {
    post,
    edit,
    put
}