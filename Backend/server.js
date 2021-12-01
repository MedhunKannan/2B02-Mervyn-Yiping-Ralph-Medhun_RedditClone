const express = require('express')
const formData = require('express-form-data')
const path = require('path')
const ApiRouter = require('./routers/api')

// The web server
const app = express()
var port = 8000
var hostname = 'localhost'

// To handle body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Web Server
// app.use(express.static(path.join(__dirname, 'public')))

const cors = require('cors')
app.use(cors())



// remove all files size = 0
app.use(formData.format())

// APIs
app.use('/api', ApiRouter)

app.use(express.Router())

// TODO: 404 Handler

// TODO: Error Handler

// Listen to port
app.listen (process.env.PORT || 8000, function () {});