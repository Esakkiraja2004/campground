const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
    email:{
        type :'string',
        required: true,
        unique: true,
    }
})

userSchema.plugin(passportLocalMongoose);

const user = new mongoose.model('user', userSchema);

module.exports = user;