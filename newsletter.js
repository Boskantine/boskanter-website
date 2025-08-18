const nodemailer = require("nodemailer")
const dotenv = require("dotenv").config()
const fs = require("fs")

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.TELENETSERVER,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.TELENETUSER, 
        pass: process.env.TELENETPASSWORD
    }, 
    tls: {
        rejectUnauthorized: false
    }
  })
}

const transporter = createTransporter()

async function confirmationMail(email, token) {
    await transporter.sendMail({
        from: process.env.MAILSENDERUSER,
        to: email,
        subject: "Confirm your email adress",
        text: `To confirm your subscription to the Boskanter newsletter, follow this link: ${process.env.DOMAIN}/en/newsletter/confirm/?${token}`,
        html: `<p>To confirm your subscription to the Boskanter newsletter, click <a href="${process.env.DOMAIN}/en/newsletter/confirm/?${token}">here</a>.</p>`
    })
}

let styles = {
    "h1, h2, h3, h4, h5, h6": "font-family: Consolas, monospace; font-weight: normal; text-transform: uppercase",
    "p": "font-family: 'Verdana', sans-serif",
    "img": "max-width: 100%; max-height: 30em; display: block; margin: auto; text-align: center;",
    "table": "border-collapse: collapse; margin: auto",
    "td, th": "padding: 0.5em; border: 1px solid #555555"
}

let rules = {
    "img, table": { before: "</td></tr><tr><td style='padding: 0em 1em 0em 1em; text-align: center'>", after: "</td></tr><tr><td>"}
}

async function sendNewsletter(recipients, text, html, title, attachments) {
    console.log("in sendnewsletter")
    let beginning = '<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff3d2">'
        + '<td style="padding: 20px 1em 0em 1em">' + applyStylesInline(`<h1>${title}</h1>`, styles) + "</td>"
        + "<tr><td style='padding: 0em 1em 0em 1em'>" + wrapHtmlTags(applyStylesInline(html, styles), rules) + "</td></tr>"
        + "<tr><td style='background-color: #004d1a; color: #ffffff'><footer style='text-align: center; padding: 1em'>"
        + "<p style='color: #29cf60'>Dont want to receive these anymore? <br><a href='"    
    let end = "' style='color: #fff3d2; text-decoration: underline'>Click here to unsubscribe.</a></p>"
            + "<p>Koningsweg 1, 9660 Brakel, België - info@boskanter.be - 055/600617</p>"
            + "</footer></td></tr>"
        + "</table>"

    for (r of recipients) {
        let middle = `${process.env.DOMAIN}/en/newsletter/unsubscribe/?${r[1]}`
	console.log("about to send to", r)
        await transporter.sendMail({
            from: process.env.MAILSENDERUSER, 
            to: r[0],
            subject: title,
            text: text + `\n\nTired of receiving these? Unsubscribe here: ${middle}`,
            html: beginning + middle + end,
            attachments: attachments
                .filter((a) => fs.existsSync(`mail_attachements/${a}`))
                .map((a) => ({ path: `mail_attachements/${a}` }))
        })
	console.log("did it")
    }
}

function applyStylesInline(html, styles) {
    for (el in styles) {
        html = html.replaceAll(new RegExp(`(?<=<(${el.split(/, */).join("|")}))(?!\\w)`, "g"), ` style="${styles[el]}"`)
    }
    return html
}

function wrapHtmlTags(html, rules) {
    for (el in rules) {
        html = html.replaceAll(new RegExp(`(?=<(${el.split(/, */).join("|")}))`, "g"), rules[el].before)
        html = html.replaceAll(new RegExp(`(?<=<\/(${el.split(/, */).join("|")})>)`, "g"), rules[el].after)
        html = html.replaceAll(new RegExp(`(?<=<(${el.split(/, */).join("|")})[^>]*/>)`, "g"), rules[el].after)
    }
    return html
}

module.exports = {
    confirmationMail: confirmationMail,
    send: sendNewsletter
}

transporter.sendMail({
        from: process.env.TELENETRUSER, 
        to: "philipp.kusterer@proton.me",
        subject: "Automatic email",
        text: "This email was sent automatically via telenet"
    })

