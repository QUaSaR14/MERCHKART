const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUser,
  updateUser,
  userPurchaseList
} = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

// Param Extractor
// It is fired when there is :userId in a route
router.param("userID", getUserById);

router.get("/user/:userID", isSignedIn, isAuthenticated, getUser);
router.put("/user/:userID", isSignedIn, isAuthenticated, updateUser);

router.get(
  "/orders/user/:userID",
  isSignedIn,
  isAuthenticated,
  userPurchaseList
);

module.exports = router;
