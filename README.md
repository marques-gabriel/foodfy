<p align="center">
  <img src="https://img.shields.io/badge/feito%20por-Gabriel%20Marques-black">
  <img src="https://img.shields.io/badge/languages-4-7159c1">
  <img src="https://img.shields.io/badge/license-MIT-black">
  <img src="  https://img.shields.io/badge/status-Conclu%C3%ADdo-brightgreen">
</p>

<h1 align="center">
    <img alt="Foodfy" title="Foodfy" src="./assets/banner.png" />
</h1>

<p align="center">
 <a href="#-sobre-o-projeto">Sobre</a> •
 <a href="#-funcionalidades">Funcionalidades</a> •
 <a href="#-como-executar-o-projeto">Como executar</a> • 
 <a href="#-tecnologias">Tecnologias</a> • 
 <a href="#-Como-contribuir-para-o-projeto">Contribua</a> • 
 <a href="#-autor">Autor</a> • 
 <a href="#user-content--licença">Licença</a>
</p>

## 💻 Sobre o projeto

🍕 Foodfy - aplicação web para explorar receitas, gerenciar o cadastro de receitas, chefes e usuários.

Projeto desenvolvido durante a **Bootcamp Launchbase** oferecido pela [Rocketseat](https://rocketseat.com.br/).
O Bootcamp foi uma experiência online com muito conteúdo prático e desafios para dominar programação web do zero.

***

## ⚙️ Funcionalidades

- [x] Usuários cadastrados no site podem:
  - [x] criar suas próprias receitas, associando-as aos chefes cadastrados no site
  - [x] editar ou excluir suas receitas cadastradas
  - [x] editar seus dados de acesso ao sistema
  - [x] receitas podem ter os seguintes itens: 
    - nome
    - imagens associadas às receitas
    - chef criador da receita
    - ingredientes
    - modo de preparo
    - informações adicionais

- [x] Os usuários cadastrados como administrador tem acesso a todo o sistema, podendo:
  - [x] gerenciar cadastro de todos as receitas e chefes
  - [x] cadastrar novos chefes para criação de receitas
  - [x] gerenciar cadastro de todos os demais usuários

- [x] Site pode ser acessado por qualquer usuário não cadastrado, podendo:
    - visualizar todas receitas cadastradas no site e seus detalhes
    - visualizar todos chefes cadastrados e quantidade de receitas
    - realizar busca de receitas, incluindo paginação.

---

## 🚀 Como executar o projeto

### 💡 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/). 
Um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/). Além disso, será preciso ter o [Postgres](https://www.postgresql.org/) instalado para criação do banco de dados.

#### 🎲 Rodando o Backend (servidor)

```bash

# Clone este repositório
$ git clone https://github.com/marques-gabriel/foodfy.git

# Instale as dependências
$ npm install

# Conexão com o banco de dados
$ edite o arquivo "db.js" dentro da pasta "src/config" com o user e password Postgres

# Criar o banco de dados e as tabelas
$ utilize os comandos inclusos no arquivo database.sql 

# Popule o banco de dados usando o arquivo "seed.js"
$ node seed.js

# Criar Novos Usuários e Recupeção de Senha
$ edite o arquivo mailer.js dentro da pasta scr/lib com suas credenciais (mailtrap) para utilizar esse recurso.

# Inicie a aplicação
$ npm start

```
**__Não exclua ou altere as imagens chefe.png e receita.png da pasta plublic/images, pois as receitas e chefs gerados pelo seed.js compartilham desses arquivos entre si. Caso tenha excluído, elas também estão disponíveis na pasta assets Então crie novos chefs e receitas antes de testar a aplicação com edição e remoção de receitas e chefes.__**

**Senha padrão para acesso de todo usuário: __12345__**

---

## 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

-   **[NodeJS](https://nodejs.org/en/**
-   **[Express](https://expressjs.com/)**
-   **[Express-session](https://github.com/expressjs/session)**
-   **[Nunjucks](https://mozilla.github.io/nunjucks/)**
-   **[Postgresql](https://www.postgresql.org/)**
-   **[Pg](https://www.npmjs.com/package/pg)**
-   **[Connect-pg-simple](https://github.com/voxpelli/node-connect-pg-simple)**
-   **[Multer](https://github.com/expressjs/multer)**
-   **[Nodemailer](https://nodemailer.com/about/)**
-   **[BcryptJS](https://github.com/dcodeIO/bcrypt.js)**
-   **[Faker](https://github.com/Marak/Faker.js)**
-   **[Nodemon](https://www.npmjs.com/package/nodemon)**
-   **[Method-override](https://www.npmjs.com/package/method-override)**
-   **[Npm-run-all](https://www.npmjs.com/package/npm-run-all)**
-   **[browser-sync](https://www.npmjs.com/package/browser-sync)**

> Veja o arquivo  [package.json](https://github.com/marques-gabriel/foodfy/blob/master/package.json)

***

## 💪 Como contribuir para o projeto

1. Faça um **fork** do projeto.
2. Crie uma nova branch com as suas alterações: `git checkout -b my-feature`
3. Salve as alterações e crie uma mensagem de commit contando o que você fez: `git commit -m "feature: My new feature"`
4. Envie as suas alterações: `git push origin my-feature`

---

## 🦸 Autor

<a href="https://github.com/marques-gabriel">
 <img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/59850744?s=400&u=6ee39d4a57ffa11d755dd0e391396224b66f11f8&v=4" width="100px;" alt=""/>
 <br />
 <sub><b>Gabriel Marques</b></sub></a> <a href="https://www.linkedin.com/in/marques-gabriel/"">🚀</a>
 <br />

---

## 📝 Licença

Este projeto esta sobe a licença [MIT](./LICENSE).

Feito com 💜  por Gabriel Marques 👋🏽 [Entre em contato!](https://www.linkedin.com/in/marques-gabriel/)

---
