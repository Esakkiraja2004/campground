const express = require('express');
const router = express.Router();
const catchError = require('../utils/catchError');
const cammod = require('../models/schema');
const reviewSchema = require('../models/review');



router.post('/', catchError(async (req, res) => {
    const { id } = req.params;
    const camp = await cammod.findById(id);
    const { review, rating } = req.body;
    const reviews_data = await reviewSchema({ body: review, rating });
    reviews_data.author = req.user._id;
    await reviews_data.save();
    camp.reviews.push(reviews_data._id);
    await camp.save();
    req.flash('review', 'Campground created successfully!');
    res.redirect(`/campgrounds/${id}`);
  }));
  
  router.delete('/:reviewId', catchError(async (req, res) => {
    const { id, reviewId } = req.params;
    await cammod.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await reviewSchema.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  }));
  

module.exports = router