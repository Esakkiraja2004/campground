const reviewSchema = require('../models/review')
const cammod = require('../models/schema')
module.exports.addReview = async (req, res) => {
  console.log('User Object:', req.user); // Debugging

  // Check if user is logged in
  if (!req.user || !req.user._id) {
      req.flash('error', 'You must be logged in to add a review.');
      return res.redirect('/login');
  }

  const { id } = req.params;

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
};

  module.exports.deleteReview = async (req, res) => {
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
  }