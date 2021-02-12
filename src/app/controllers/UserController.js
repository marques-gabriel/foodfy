const { hash } = require('bcryptjs')
const User = require('../models/User')
const Recipe = require('../models/Recipe')

const crypto = require('crypto')
const mailer = require('../../lib/mailer')
const { Console } = require('console')


module.exports = {

    registerForm(req, res) {

        return res.render("admin/users/register")
    },

    async edit(req, res) {

            const { user } = req


            // const user = await User.findOne({where: { id: req.params.id }})

        return res.render("admin/users/edit", { user })
    },

    list(req, res) {
        return res.render("admin/users/index")
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

            req.session.userId = userId

            const emailHtml = (user, password) => `
                <h2>Olá ${user.name}</h2>
                <p>Sua conta foi cadastrada com sucesso</p>
                <p><br/><br/></p>
                <h3>Dados da conta</h3>
                <p>Nome: ${user.name}</p>
                <p>Email: ${user.email}</p>
                <p><br/><br/></p>
                <strong><p>Essa é a sua senha de acesso (NÃO PASSE PARA NINGUÉM)</p></strong>
                <p><br/><br/></p>
                <p>Senha: ${password}</p>
            `

            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Conta cadastrada no foodfy',
                html: emailHtml(user, password)
            })

            return res.render("admin/session/login", {
                user,
                success: `Conta cadastrada com sucesso! Enviamos sua senha de acesso para o email ${user.email}.`
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

            return res.render("admin/users/profile", {
                user: req.body,
                success: "Conta atualizada com sucesso"
            })
            
        } catch (error) {
            console.error(error)
            return res.render("admin/users/profile", {
                error: "Algum erro ocorreu"
            })
        }

    },

    async delete(req, res) {
        try {

            const recipes = await Recipe.findAll({where: { user_id: req.body.id }})

            // pegar todas imagens das receitas 
            const allFilesPromise = recipes.map(recipe => 
                Recipe.files(recipe.id)
            )

            let promiseResults = await Promise.all(allFilesPromise)

            // rodar a remocao do usuario 
            await User.delete(req.body.id)
            req.session.destroy()

            // remover imagens da pasta public 
            promiseResults.map(files => {
                files.map(file => {

                    try {
                        unlinkSync(file.path)
                    } catch (err) {
                        console.log(err)
                    }
                })
            })

            return res.render("admin/session/login", {
                success: "Conta deletada com sucesso!"
            })

        } catch (error) {
            console.error(err)
            return res.render("admin/users/profile", {
                user: req.body,
                error: "Erro ao deletar a conta"
            })
        }
    }
}

    