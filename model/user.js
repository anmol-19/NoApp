const mongoose = require('mongoose');

const User = mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true,
    }
})

module.exports = mongoose.model('user',User);