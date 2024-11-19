const cammod = require('../models/schema');

const isAuthorized = async (req, res, next) => {
  const { id } = req.params;
  try {
    const modifiedCamps = await cammod.findById(id);
    if (!modifiedCamps) {
      req.flash('error', 'Campground not found!');
      return res.redirect('/campgrounds');
    }
    if (!modifiedCamps.author.equals(req.user._id)) {
      req.flash('error', 'You are unauthorized to perform this action!');
      return res.redirect(`/campgrounds/${id}`);
    }
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    req.flash('error', 'Something went wrong!');
    return res.redirect('/campgrounds');
  }
};

module.exports = isAuthorized;
