const express = require('express');
const router = express.Router({ mergeParams: true });
const catchError = require('../utils/catchError');
const cammod = require('../models/schema');
const reviewSchema = require('../models/review');



router.post('/', catchError(async (req, res) => {
  const { id } = req.params; // Inherited from parent route

  console.log('Request Params:', req.params); // Debugging: { id: 'someId' }

  const camp = await cammod.findById(id);
  if (!camp) {
      req.flash('error', 'Campground not found!');
      return res.redirect('/campgrounds');
  }

  const { review, rating } = req.body;
  const reviews_data = new reviewSchema({ body: review, rating });
  reviews_data.author = req.user._id;

  await reviews_data.save();

  camp.reviews.push(reviews_data._id);
  await camp.save();

  req.flash('success', 'Review added successfully!');
  res.redirect(`/campgrounds/${id}`);
}));

  router.delete('/:reviewId', catchError(async (req, res) => {
    const { id, reviewId } = req.params;
    await cammod.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await reviewSchema.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  }));
  

module.exports = router