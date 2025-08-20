const express = require('express')
const bodyParser = require('body-parser')
const exec = require("child_process").exec
const {readFileSync} = require("fs")
const fs = require("fs/promises")
const crypto = require("crypto")
const dotenv = require("dotenv").config()
const blogsearch = require("./blogsearch.js")
const gallerysearch = require("./gallerysearch.js")

const app = express()
const port = 3000

app.use(bodyParser.text())

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
