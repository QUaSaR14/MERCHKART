const  { validationResult } = require('express-validator')
const User = require('../models/user');
const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt');

exports.signup = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array()[0].msg });
    }

    const user = new User(req.body);
    user.save((err, user) => { 
        if(err) return res.status(400).json({
            err : "Not able to save user in DB"
        })
        res.json({
            name: user.name,
            email : user.email,
            id : user._id
        })
     });
}

exports.signin = (req, res) => {
    // Destructure the request body
    const { email, password } = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array()[0].msg });
    }    

    // Auuthenticate user
    User.findOne({ email }, (err, user) => {
        
        // Check for user email match
        if(err || !user) {
            return res.status(400).json({
                error : "User Email does not exist"
            })
        }

        // Check for password match
        if(!user.authenticate(password)){
            return res.status(401).json({
                error : "Email and Password do not match :("
            })
        }

        // Create jwt token
        const token = jwt.sign({ name: user.name, _id : user._id, role: user.role, email: user.email }, process.env.SECRET)

        // Put token in cookie
        res.cookie("token", token, { 
            httpOnly : true,
            expire : new Date() + 300,
            secure : process.env.NODE_ENV === 'production' ? true : false,
        });

        // Send response to frontend
        const { _id, name, email, role } = user;
        return res.status(200).json({ token, user : { _id, name, email, role }})

    })
}

exports.signout = (req, res) => {

    // Simply clear the user cookie 
    res.clearCookie("token");
    res.json({
        message : "User Signout, bye !",
        status : "Success"
    });
}


// protected routes
// It simply decodes jwt send from frontend and stores payload in req.auth
exports.isSignedIn = expressJWT({
    secret : process.env.SECRET,
    userProperty : "auth" 
})

// custom middleware
exports.isAuthenticated = (req, res, next) => {

    // profile comes from frontend
    // check if profile user exist and 
    // it is signed in and 
    // signed in user is same as user in the request
    let checker = req.profile && req.auth && (req.profile._id == req.auth._id);
    if(!checker) {
        return res.status(403).json({
            error : "ACCESS DENIED :/"
        })
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    
    if(req.profile.role === 0) {
        return res.status(403).json({
            error : "You are not Admin, ACCESS DENIED :/ "
        })
    }
    next();
}

exports.validate = (req, res) => {

    if(!req.cookies.token) return res.status(401).json({
        error : "Unauthorized access :|"
    })
    const token = req.cookies.token
    jwt.verify(token, process.env.SECRET, (err, user) => {
        if(err){ 
            return res.status(403).json({
                message : "Access Denied :/"
            })
        }
        console.log(user)
        return res.status(200).json(user)
    })
}

exports.getToken = (req, res) => {
    if(!req.cookies.token) return res.status(401).json({
        error : "Unauthorized access :|"
    })
    const token = req.cookies.token
    return res.status(200).json(token)
}