const User = require("../models/User")
const Recipe = require('../models/Recipe')


function onlyUsers(req, res, next) {
    
    if (!req.session.userId)
        return res.redirect('/admin/users/login')
    
    next()
}

async function ownUserOrAdmin(req, res, next) {

    const { userId } = req.session

    const user = await User.findOne({ where: { id: userId }})

    let results = await Recipe.find(req.params.id)
    const recipe = results.rows[0].user_id

    if((userId != recipe) && (user.is_admin == false)) 
        return res.render('admin/users/profile', {
            user,
            error: 'Você não tem permissão para editar receitas que não sejam suas'
    })


    next()

}

async function onlyAdmin (req, res, next) {

    const { userId: id } = req.session

    const user = await User.findOne({ where: {id}})

    if (user.is_admin == false)
        return res.render('admin/users/profile', {
            error: 'Você não tem permissão de acesso a esta página',
            user
        })

    next()

}

module.exports = {
    onlyUsers,
    ownUserOrAdmin,
    onlyAdmin
}