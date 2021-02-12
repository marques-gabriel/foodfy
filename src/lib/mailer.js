const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "8793987b5205aa",
      pass: "5fb3d1f47d8a92"
    }
  })

