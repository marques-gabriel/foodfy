const User = require('../models/User')
const { compare } = require('bcryptjs')

async function login(req, res, next) {

    const { email, password } = req.body

    const user = await User.findOne({ where: { email} })

    if(!user) return res.render("admin/session/login", {
        user: req.body,
        error: "Usuário não cadastrado no sistema"
    })


    const passed = await compare(password, user.password)

    if(!passed) return res.render("admin/session/login", {
        user: req.body,
        error: "Senha está incorreta."
    })

    req.user = user

    next()

}


module.exports = {
    login
}