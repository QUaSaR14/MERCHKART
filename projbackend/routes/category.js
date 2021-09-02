const express = require('express')
const router = express.Router()

const { 
    getCategoryById, 
    createCategory, 
    getCategory, 
    getAllCategory, 
    updateCategory, 
    removeCategory
} = require('../controllers/category')
const { isSignedIn, isAdmin, isAuthenticated } = require('../controllers/auth')
const { getUserById } = require('../controllers/user')

// Param Extractor
router.param("userID", getUserById)
router.param("categoryID", getCategoryById)

// ROUTES

// Create Routes
router.post(
    '/category/create/:userID', 
    isSignedIn,
    isAuthenticated,
    isAdmin, 
    createCategory
)

// Read Routes
router.get('/category/:categoryID', getCategory)
router.get('/categories', getAllCategory)

// Update Route

router.put(
    '/category/:categoryID/:userID', 
    isSignedIn, 
    isAuthenticated, 
    isAdmin, 
    updateCategory
)

// Delete Route
router.delete(
    '/category/:categoryID/:userID', 
    isSignedIn, 
    isAuthenticated, 
    isAdmin, 
    removeCategory
)


module.exports = router