const User = require('../models/User')
const { compare } = require('bcryptjs')

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

async function put(req, res, next) {


    const fillAllFields = checkAllFields(req.body)
    if(fillAllFields) {
        return res.render("admin/users/index", fillAllFields)
    }

    const { id, password, email } = req.body

    if(!password) return res.render("admin/users/profile", {
        user: req.body,
        error: "Coloque sua senha para atualizar seu cadastro"
    })

    const user = await User.findOne({ where: {id} })

        let userEmail = await User.findOne(
            {
                where: { email }
    
            })

        if (userEmail && (userEmail.id != user.id)) return res.render('admin/users/profile', {
            user: req.body,
            error: 'Email já está em uso por outro usuário'
        })

    const passed = await compare(password, user.password)

    if(!passed) return res.render("admin/users/profile", {
        user: req.body,
        error: "Senha incorreta."
    })

    req.user = user

    next()

}

async function show(req, res, next) {

    const { userId: id } = req.session

    const user = await User.findOne({ where: {id} })

    if(!user) return res.render("admin/users/register", {
        error: "Usuário não encontrado"
    })

    req.user = user

    next()

}

module.exports = {
    show,
    put
}