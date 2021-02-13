module.exports = {

    loginForm(req, res) {
        return res.render("admin/session/login")
    },

    forgotForm(req, res) {

        return res.render("admin/session/forgot-password")

    },

    resetForm(req, res) {
        return res.render("admin/session/password-reset", { token: req.query.token })
    },

    login(req, res) {

        req.session.userId = req.user.id
        const user = req.user

        return res.render("admin/users/profile", {
            
            success: 'Login realizado com sucesso',
            user
        })

    },

}