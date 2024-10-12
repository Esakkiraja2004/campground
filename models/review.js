const mongoose = require('mongoose');
const User   = require('./user')

const reviewSchema = new mongoose.Schema({
    body : 'string',
    rating: 'number',
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
})

const review = mongoose.model('review', reviewSchema);

module.exports = review