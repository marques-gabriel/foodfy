const { hash } = require('bcryptjs')
const User = require('../models/User')
const Recipe = require('../models/Recipe')

const crypto = require('crypto')
const mailer = require('../../lib/mailer')


module.exports = {

    registerForm(req, res) {

        return res.render("admin/users/register")
    },

    async edit(req, res) {

            const { user } = req

            // const user = await User.findOne({where: { id: req.params.id }})

        return res.render("admin/users/edit", { user })
    },

    async list(req, res) {

        const users = await User.findAll()

        return res.render("admin/users/index", { users })
    },

    async post(req, res) {

        try {

            let { name, email } = req.body

            const password = crypto.randomBytes(9).toString("hex")
            const passwordHash = await hash(password, 8)

            const userId = await User.create({
                name,
                email,
                password: passwordHash,
                is_admin: req.body.is_admin || false
            })

            const user = await User.findOne({where: { id: userId }})

            // req.session.userId = userId

            const emailHtml = (user, password) => `
                <h2>Olá ${user.name}</h2>
                <p>Sua conta foi cadastrada com sucesso</p>
                <p><br/></p>
                <h3>Dados da conta</h3>
                <p>Nome: ${user.name}</p>
                <p>Email: ${user.email}</p>
                <p><br/><br/></p>
                <strong><p>Essa é a sua senha de acesso (NÃO PASSE PARA NINGUÉM)</p></strong>
                <p><br/></p>
                <p>Senha: ${password}</p>
                <a href="http://localhost:3000/admin/users/login">CLIQUE AQUI PARA REALIZAR O LOGIN</a>
                <p><br/></p>

            `

            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Conta cadastrada no foodfy',
                html: emailHtml(user, password)
            })

            const users = await User.findAll()

            return res.render("admin/users/index", {
                users,
                success: `Conta cadastrada com sucesso! Enviamos a senha de acesso para o email ${user.email}.`
            })
            
        } catch (error) {
            console.error(error)
        }
    },

    async put(req, res) {
        try {

            const { user } = req

            let { name, email } = req.body

            await User.update(user.id, {
                name,
                email,
                is_admin: req.body.is_admin || false
            })

            return res.render("admin/users/index", {
                user: req.body,
                success: `Conta de ${name} atualizada com sucesso`
            })
            
        } catch (error) {
            console.error(error)
            return res.render("admin/users/index", {
                error: "Algum erro ocorreu"
            })
        }

    },

    async delete(req, res) {
        try {

            const recipes = await Recipe.findAll({where: { user_id: req.body.id }})

            // rodar exclusao das receitas do usuario
            recipes.map(recipe => {
                Recipe.delete(recipe.id)
            })

            // rodar a remocao do usuario 
            await User.delete(req.body.id)
            // req.session.destroy()

            return res.render("admin/users/index", {
                success: "Conta deletada com sucesso!"
            })

        } catch (error) {
            console.error(error)
            return res.render("admin/users/profile", {
                user: req.body,
                error: "Erro ao deletar a conta"
            })
        }
    }
}

    