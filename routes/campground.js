const express = require('express');
const router = express.Router();
const catchError = require('../utils/catchError');
const cammod = require('../models/schema');
const reviewSchema = require('../models/review');
const joi = require('joi');

const joiSchema = joi.object({
  title: joi.string().required(),
  location: joi.string().required(),
  place: joi.string().required(),
  description: joi.string().required(),
  image: joi.string().required(),
  price: joi.number().required()
});

const {isLoggedIn} = require('../middleWare/loginMiddleWare');

router.get('/',isLoggedIn, catchError(async (req, res) => {
  const camp = await cammod.find({});
  res.render('campground/camp', { camp });
}));

router.get('/newcamp',isLoggedIn ,  (req, res) => {
  res.render('campground/new.ejs');
});

router.get('/:id', catchError(async (req, res,) => {
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
  res.render('campground/show', { camp });
}));



router.post('/', isLoggedIn , catchError(async (req, res) => {
  const { error } = joiSchema.validate(req.body);
  if (error) return res.status(400).render('campground/error', { err: error });
  const data = await new cammod(req.body);
  data.author = req.user._id;
  await data.save();
  req.flash('success', 'Campground created successfully!');
  res.redirect('/campgrounds');
}));

router.get('/:id/edit', isLoggedIn , catchError(async (req, res) => {
  const { id } = req.params;
  const camp = await cammod.findById(id);
  res.render('campground/edit.ejs', { camp });
}));

router.put('/:id', isLoggedIn , catchError(async (req, res) => {
  const { error } = joiSchema.validate(req.body);
  if (error) return res.status(400).render('campground/error', { err: error });
  const { id } = req.params;
  const camp = await cammod.findByIdAndUpdate(id, { ...req.body });
  await camp.save();
  req.flash('update', 'Campground updated successfully!');
  res.redirect(`/campgrounds/${id}`);
}));

router.delete('/:id', isLoggedIn , catchError(async (req, res) => {
  const { id } = req.params;
  await cammod.findByIdAndDelete(id);
  req.flash('error', 'Campground has be deleted.');
  res.redirect('/campgrounds');
}));

module.exports = router;
