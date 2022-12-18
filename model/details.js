const mongoose = require('mongoose');

const detail = mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    phone:{
        type: String,
        require: true
    },
    profileUrl:{
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Details',detail);