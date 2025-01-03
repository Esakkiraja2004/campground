const cammod = require('../models/schema');
const joi = require('joi');

const joiSchema = joi.object({
  title: joi.string().required(),
  location: joi.string().required(),
  place: joi.string().required(),
  description: joi.string().required(),
  image: joi.string().required(),
  price: joi.number().required()
});

module.exports.index = async (req, res) => {
  const camp = await cammod.find({});
  res.render('campground/camp', { camp });
}

module.exports.getInfo = async (req, res,) => {
    const camp = await cammod.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(camp);
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campground/show', { camp, current_user: req.user });
  }

  module.exports.newCampground = (req, res) => {
    res.render('campground/new.ejs');
  };

  module.exports.postNewCampground = async (req, res) => {
    const { error } = joiSchema.validate(req.body);
    if (error) return res.status(400).render('campground/error', { err: error });
    const data = await new cammod(req.body);
    data.author = req.user._id;
    await data.save();
    req.flash('success', 'Campground created successfully!');
    res.redirect('/campgrounds');
  }

  module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    const camp = await cammod.findById(id);
    res.render('campground/edit.ejs', { camp });
  }

  module.exports.putEditDetails = async (req, res) => {
    const { error } = joiSchema.validate(req.body);
    if (error) return res.status(400).render('campground/error', { err: error });
    const camp = await cammod.findByIdAndUpdate(id, { ...req.body });
    await camp.save();
    req.flash('update', 'Campground updated successfully!');
    res.redirect(`/campgrounds/${id}`);
  }

  module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await cammod.findByIdAndDelete(id);
    req.flash('error', 'Campground has be deleted.');
    res.redirect('/campgrounds');
  }