const express = require('express')
const router = express.Router()

const { 
    getProductById, 
    createProduct, 
    getProduct, 
    photo, 
    deleteProduct, 
    updateProduct,
    getAllProducts,
    getAllUniqueCategories
 } = require('../controllers/product')
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth')
const { getUserById } = require('../controllers/user')

// Param Extractor
router.param("productID", getProductById)
router.param("userID", getUserById)

// ROUTES

// Create Route
router.post(
    "/product/create/:userID", 
    isSignedIn, 
    isAuthenticated, 
    isAdmin, 
    createProduct
)

// Read Routes
router.get('/product/:productID', getProduct)
router.get('/product/photo/:productID', photo)

// Update Route
router.put(
    "/product/:productID/:userID", 
    isSignedIn, 
    isAuthenticated, 
    isAdmin, 
    updateProduct
)

// Delete Route
router.delete(
    "/product/:productID/:userID", 
    isSignedIn, 
    isAuthenticated, 
    isAdmin, 
    deleteProduct
)

// Listing Route
router.get("/products", getAllProducts)

// Listing Distinct Categories
router.get("/products/catergories", getAllUniqueCategories)

module.exports = router