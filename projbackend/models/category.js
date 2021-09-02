const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema ({
    name : {
        type : String,
        trim : true,
        required : true,
        maxlength : 32,
        unique : true
    },
}, { timestamps : true })  // Timestamps will store the time when any new items is added to the Schema

module.exports = mongoose.model("Category", categorySchema)
