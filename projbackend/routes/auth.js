var express = require('express')
var router = express.Router()
const  { check } = require('express-validator')
var { signout, signup, signin, isSignedIn, validate, getToken } = require("../controllers/auth")

router.post('/signup', [
    check("name").isLength({ min: 3 }).withMessage('must be at least 3 chars long'),
    check("email").isEmail().withMessage('email is required'),
    check("password").isLength({ min : 3 }).withMessage('password should be 3 char long')
], signup);

router.post('/signin', [
    check("email").isEmail().withMessage('email is required'),
    check("password").isLength({ min : 1 }).withMessage('Password field is required')
], signin);


router.get('/signout', signout);

router.get('/test', isSignedIn, (req, res) => {
    res.json(req.auth);
})

router.get('/getAuth', validate)
router.get('/getToken', getToken)

module.exports = router;