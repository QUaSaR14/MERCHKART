const express = require('express')
const router = express.Router()

const { getOrderById, createOrder, getAllOrders, getOrderStatus, updateStatus } = require('../controllers/order')
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth')
const { getUserById, pushOrderInPurchaseList } = require('../controllers/user')
const { updateStock } = require('../controllers/product')

// Param Extractor
router.param('userID', getUserById)
router.param('orderID', getOrderById)

// Create Route
router.post(
    "/order/create/:userID", 
    isSignedIn, 
    isAuthenticated, 
    pushOrderInPurchaseList, 
    updateStock, 
    createOrder
)

// Read Route
router.get(
    "/order/all/:userID", 
    isSignedIn, 
    isAuthenticated, 
    isAdmin, 
    getAllOrders
)

// Status of order
router.get(
    "/order/status/:userID", 
    isSignedIn, 
    isAuthenticated, 
    isAdmin, 
    getOrderStatus
)
router.put(
    "/order/:orderID/status/:userID", 
    isSignedIn, 
    isAuthenticated, 
    isAdmin, 
    updateStatus
)

// Update Route



module.exports = router