const express = require('express')
const bodyParser = require('body-parser')
const exec = require("child_process").exec
const {readFileSync} = require("fs")
const fs = require("fs/promises")
const crypto = require("crypto")
const dotenv = require("dotenv").config()
const blogsearch = require("./blogsearch.js")
const gallerysearch = require("./gallerysearch.js")
const newsletter = require("./newsletter.js")

const app = express()
const port = 3000

app.use(bodyParser.text())

async function scanCSV(filename, rowProcessor) {
  let file = await fs.open(filename, "r")
  let output = {text: "", info: null, arr: []}
  let head = true
  for await (line of file.readLines()) {
    if (head) {
      output.text += line
      head = false
      continue
    }
    row = line.split(",")
    rowProcessor(output, row)
  }
  return output
}


// Jemand gibt auf der Website seine Email Adresse an

async function addToABTS(email, token) {
  abts = await scanCSV("about_to_subscribe.csv", (output, row) => {
    if (Date.now()-parseInt(row[2]) <= 1800000) {  
      output.text += "\n" + row.join(",")
    }
  })
  abts.text += `\n${email},${token},${Date.now()}`
  await fs.writeFile("about_to_subscribe.csv", abts.text)
}

app.post('/api/newsletter/subscribe', (req, res) => {
  if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body)) {
    res.end(`${req.body} is not a valid email adress.`)
    return
  }
  const token = crypto.randomBytes(20).toString("hex") 
  addToABTS(req.body, token)
  newsletter.confirmationMail(req.body, token)
  res.end(`An email has been sent to ${req.body}. Click confirm email to finalize your subscription.`)
})


// Jemand folgt dem Link der ihm per Mail geschickt wurde um seine Email Adresse zu bestätigen

async function getEmailFromABTS(url) {
  abts = await scanCSV("about_to_subscribe.csv", (output, row) => {
    if (Date.now()-parseInt(row[2]) <= 1800000) {  
      output.text += "\n" + row.join(",")
    }
    if (row[1] == url) {
      console.log("url wurde gefunden")
      output.info = row[0]
    }
  })
  fs.writeFile("about_to_subscribe.csv", abts.text)
  return abts.info
}

async function addToML(email) {
  ml = await scanCSV("mailinglist.csv", (output, row) => {
    if (row[1] == email) {
      output.info = "email already in newsletter"
    }
  })
  if (ml.info === null) {
    await fs.appendFile("mailinglist.csv", `\n${email},${crypto.randomBytes(20).toString("hex")}`)
  } 
}

app.post('/api/newsletter/confirm', async (req, res) => {
  let email = await getEmailFromABTS(req.body)
  if (email === null) {
    res.end("Your confirmation URL has expired, subscribe again to get a new confirmation URL")
  }
  else {
    await addToML(email)
    res.end("You are now subscribed to the newsletter")
  }
})


// unsubscribe

async function removeURLFromML(url) {
  ml = await scanCSV("mailinglist.csv", (output, row) => {
    console.log(row[1], url)
    if (row[1] == url) {
      output.info = "URL gefunden"
      console.log("URL gefunden")
    } 
    else {
      output.text += `\n${row.join(",")}`
    }
  })
  if (ml.info == "URL gefunden") {
    fs.writeFile("mailinglist.csv", ml.text)
  }
}

app.post('/api/newsletter/unsubscribe', (req, res) => {
  removeURLFromML(req.body)
  res.end("")
})


// build

function newlineToBr(std) {
  return std.split("").map((c) => (c == "\n") ? "<br>" : c).join("")
}

app.post('/api/build', (req, res) => {
  if (req.body == process.env.ADMIN_PASSWORD) {
    exec('git pull; eleventy', (error, stdout, stderr) => {
      if (error) {
        res.end(`<h2>error</h2>${newlineToBr(error.toString())}`)
        return
      }
      res.end(`<h2>stdout</h2>${newlineToBr(stdout)}<h2>stderr</h2>${newlineToBr(stderr)}`)
      exec('pm2 restart server', (error, stdout, stderr) => { return })
    })
  }
  else {
    res.end("The password was not correct")
  }
})


// picturepreview

app.post('/api/picturepreviews', (req, res) => {
  if (req.body == process.env.ADMIN_PASSWORD) {
    exec('node picturepreviews.js', (error, stdout, stderr) => {
      if (error) {
        res.end(`<h2>error</h2>${newlineToBr(error.toString())}`)
        return
      }
      res.end(`<h2>stdout</h2>${newlineToBr(stdout)}<h2>stderr</h2>${newlineToBr(stderr)}`)
      exec('pm2 restart server', (error, stdout, stderr) => { return })
    })
  }
  else {
    res.end("The password was not correct")
  }
})


// sendnewsletter

app.post("/api/sendnewsletter", async (req, res) => {
  const reqParsed = JSON.parse(req.body)
  if (reqParsed.password == process.env.ADMIN_PASSWORD) {
    recipients = (reqParsed.recipients == "everybody" 
      ? (await scanCSV("mailinglist.csv", (output, row) => { output.arr.push([row[0],row[1]]) })).arr 
      : reqParsed.recipients.split(/[, ]+/).map((r) => [r, ""]))
    attachments = (reqParsed.attachments == "" 
      ? []
      : reqParsed.attachments.split(/ *, */))
    newsletter.send(recipients, reqParsed.text, reqParsed.html, reqParsed.title, attachments)
    res.end("success")
  }
  else {
    res.end("wrong password")
  }
})


// get mailinglist

app.post("/api/getmailinglist", async (req, res) => {
  const password = req.body  
  if (password == process.env.ADMIN_PASSWORD) {
    res.end(readFileSync("mailinglist.csv"))
  }
  else {
    res.end("wrong password")
  }
})


// update mailinglist

app.post("/api/updatemailinglist", async (req, res) => {
  const reqParsed = JSON.parse(req.body)
  if (reqParsed.password == process.env.ADMIN_PASSWORD) {
    for (change of reqParsed.changes.map((c) => c.split(" "))) {
      if (change[0] == "remove") {
        await removeURLFromML(change[1])
      }
      if (change[0] == "add") {
        await addToML(change[1])
      }
    }
    res.end("success")
  }
  else {
    res.end("wrong password")
  }
})


// Blogposts nach Kategorie

app.post('/api/blog/postsbycategory', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(blogsearch.posts[req.body]))
})

app.post('/api/blog/search', (req, res) => {
  let r = JSON.parse(req.body)
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(blogsearch.category[r.category].search(r.query, {
    boost: {title: 2, tags: 2},
    prefix: true,
    fuzzy: 0.2
  })))
})

// Gallerypictures nach Kategorie

app.post('/api/gallery/picturesbycategory', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(gallerysearch.pictures[req.body]))
})

app.post('/api/gallery/search', (req, res) => {
  let r = JSON.parse(req.body)
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(gallerysearch.category[r.category].search(r.query, {
    prefix: true,
    fuzzy: 0.2
  })))
})


app.listen(port, () => {console.log(`server running on port ${port}`)})
