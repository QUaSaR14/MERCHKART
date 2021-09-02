const express = require('express')
const app = express()

const port = 8000

const admin = (req, res) => {
    return res.send("Apun is sarvashaktishali Bhagwan hai !!")
}

app.get('/', (req, res) => res.send('Hello World!'))

const isAdmin = (req, res, next) => {
    console.log('isAdmin is Running')
    next()
}

app.get('/admin', isAdmin, admin)

const isLoggedIn = (req, res, next) => {
    console.log("You are logged in ... ")
    next()
}

app.get('/login' , isLoggedIn, (req, res) => {
    res.send("Abe idhar kyu aaya be gandu ... ")
})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))