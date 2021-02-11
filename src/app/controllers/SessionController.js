module.exports = {

    loginForm(req, res) {
        return res.render("admin/session/login")
    },

    forgotForm(req, res) {

        return res.render("admin/session/forgot-password")

    },

    resetForm(req, res) {
        return res.render("admin/session/password-reset", { token: req.query.token })
    }

}