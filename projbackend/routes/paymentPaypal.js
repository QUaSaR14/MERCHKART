const express = require('express')
const router = express.Router()

const { isSignedIn, isAuthenticated } = require('../controllers/auth')
const { getToken, processPayment } = require('../controllers/paymentPaypal')
const { getUserById } = require('../controllers/user')

// Param extractor
router.param("userID", getUserById)

// Routes
router.get("/payment/gettoken/:userID", isSignedIn, isAuthenticated, getToken)

router.post("/payment/braintree/:userID", isSignedIn, isAuthenticated, processPayment)

module.exports = router