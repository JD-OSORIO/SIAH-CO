const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type:String,
        require: true
    },
    userName: {
        type:String,
        require: true
    },
    pass: {
        type:String,
        require: true
    },
    role: {
        type:String,
        require: true
    },
    accessToken:{
        type: String
    }
})

module.exports = mongoose.model('User', userSchema)