const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()

const db = require('./db')

const {userRouter} = require('./users/user.routes')

const app = express()
const port = process.env.PORT

db.connnectToDb()

const headSetter = (req, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')

    next()
}
app.use(bodyParser.json())
app.use(headSetter)

app.use('/api/user', userRouter)


app.get("*", (req, res) => {
    res.status(404).json({"error":"Page not found"})
})

app.listen(port, () => console.log(`app listening on port ${port}!`))