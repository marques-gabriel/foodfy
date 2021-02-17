const User = require('../models/User')
const { hash } = require('bcryptjs')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')

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

    logout(req, res) {

        req.session.destroy()
        return res.render("admin/session/login", {success:"Logout realizado com sucesso"})

    },

    async forgot(req, res) {

        const user = req.user


        try {

            const token = crypto.randomBytes(15).toString("hex")

            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Recuperação de senha',
                html: `<h2>Solicitação de nova senha</h2>
                <p>Clique no link abaixo para recuperar sua senha</p>
                <p>
                <a href="http://localhost:3000/admin/users/password-reset?token=${token} "target="_blank">RECUPERAR SENHA</a>
                </p>
                `,

            })

            return res.render("admin/session/forgot-password", {
                success: `Enviamos um email para ${user.email} para recuperar a senha`
            })
            
        } catch (err) {
            console.error(err)
            return res.render("admin/session/forgot-password", {
                success: "Erro ao enviar email de recuperacao de senha. Tente novamente!"
            })
        }

    },

    async reset(req, res) {

        const user  = req.user
        const { password, token } = req.body

        try {
            
            const newPassword = await hash(password, 8)

            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: ""
            })

            return res.render("admin/session/login", {
                user: req.body,
                success: "Senha atualizada! Faça seu login novamente"
            })
            
        } catch (err) {
            console.error(err)
            return res.render("admin/session/password-reset", {
                user: req.body,
                token,
                success: "Algo erro ocorreu ao atualizar sua senha. Tente novamente!"
            })
        }
    }

}