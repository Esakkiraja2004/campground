const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    body : 'string',
    rating: 'number'
})

const review = new mongoose.model('review', reviewSchema);

module.exports = review