const User = require('../models/User')


module.exports = {

    index(req, res) {

        const user = req.user

        return res.render("admin/users/profile", {
            user
        })
    },

    async put(req, res) {
        try {

            const user = req.user

            let { name, email } = req.body

            await User.update(user.id, {
                name,
                email
            })

            return res.render("admin/users/profile", {
                user: req.body,
                success: `Conta atualizada com sucesso`
            })
            
        } catch (error) {
            console.error(error)
            return res.render("admin/users/profile", {
                error: "Algum erro ocorreu ao atualizar seu perfil"
            })
        }

    }
}