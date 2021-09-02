require("dotenv").config()

const express = require('express')
const app = express()
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors")

// My routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const orderRoutes = require('./routes/order')
const paymentPayPalRoute = require('./routes/paymentPaypal')

// DB Connection
mongoose
    .connect( process.env.DB , { 
        useNewUrlParser : true,
        useUnifiedTopology : true,
        useCreateIndex : true
    }).then( () => {
    console.log("DB CONNECTED :) ")
    }).catch( () => {
        console.log("DB GOT ERR :( ")
    });

// MIDDLEWARES
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())
app.use(express.json())

// ROUTES
app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", categoryRoutes)
app.use("/api", productRoutes)
app.use("/api", orderRoutes)
app.use("/api", paymentPayPalRoute)

// PORT
const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`App is running at ${port} ... `)
})