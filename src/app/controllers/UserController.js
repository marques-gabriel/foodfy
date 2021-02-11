module.exports = {

    registerForm(req, res) {

        return res.render("admin/users/register")
    },

    edit(req, res) {
        return res.render("admin/users/edit")
    },

    list(req, res) {
        return res.render("admin/users/index")
    }
}