const mongoose = require('mongoose')
const crypto = require('crypto')
const uuidv1 = require('uuid/v1')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required :  true,
        maxlength : 32,
        trim : true,
    },
    lastname : {
        type : String,
        maxlength : 32,
        trim : true
    }, 
    email : {
        type : String,
        trim : true,
        required : true,
        unique : true,
    },
    userinfo : {
        type : String,
        trim : true
    },
    encry_password : {
        type : String, 
        required : true,
    },
    salt : String,
    role : { 
        // This is similar to the privilages of a user
        type : Number,  // The higher the number is more is its priviledge
        default : 0
    },
    purchases : {
        type : Array,
        default : []
    }
}, { timestamps : true })

userSchema.virtual("password")
    .set(function(password) {
        this._password = password // Using _<var name> is prefered for private variables
        this.salt = uuidv1() // Generate random UUID
        this.encry_password = this.securePassword(password) // Encrypting the password
    })
    .get(function() {
        return this._password
    })

userSchema.methods = {

    // Used to authenticate user
    authenticate : function(plainpassword) {
        return (this.securePassword(plainpassword) === this.encry_password)
    },
    // Used to encrypt password 
    securePassword : function(plainpassword) {
        if(!plainpassword) return "";
        try {
            return crypto.createHmac('sha256', this.salt) 
                .update(plainpassword)
                .digest('hex');
        } catch (err) {
            return "";
        }
    }
}

module.exports = mongoose.model('User', userSchema)