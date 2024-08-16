const express  = require('express');
const ejsMate = require('ejs-mate');
const catchError = require('../utils/catchError');
const expressError = require('../utils/expresserror')
const joi  = require('joi');
const path = require('path');
const cammod = require('../models/schema');
const reviewSchema = require('../models/review');
const methodOverride = require('method-override')
const app = express();
const router = express.Router();




const joiSchema = joi.object({
    title : joi.string().required(),
    location : joi.string().required(),
    place: joi.string().required(),
    description:joi.string().required(),
    image: joi.string().required(),
    price: joi.number().required()
  })
  
  router.get('/',(req, res) =>{
      res.render("index.ejs");
  });
  
  router.get('/' ,catchError( async(req, res) =>{
      const camp = await cammod.find({});
      res.render('campground/camp' , { camp});
  }));
  
  router.get('/newcamp',(req, res) => {
  
    res.render('campground/new.ejs');
  
  })
  
  router.get('/:id' , catchError(async(req, res) =>{
      const {id} = req.params;
      const camp = await cammod.findById(id).populate('reviews');
      res.render('campground/show.ejs' , { camp});
  }));
  
  router.post('/:id/review' , catchError(async(req,res) =>{
    
    const {id} = req.params;
    const camp = await cammod.findById(id);
  
    const {review , rating} =  req.body;
    const reviews_data = await reviewSchema({body : review, rating});
  
    await reviews_data.save();
    camp.reviews.push(reviews_data._id);
    await camp.save();
  
    res.redirect(`/${id}`)
  
  }))
  
  router.delete('/:id/reviews/:reviewId', catchError(async (req, res) => {
    const { id, reviewId } = req.params;
  
    // Pull the reviewId from the camp's reviews array
    await cammod.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  
    // Delete the review document itself
    await reviewSchema.findByIdAndDelete(reviewId);
  
    res.redirect(`//${id}`);
  }));
  
  
  router.post('/', catchError(async (req, res) => {
    const { error } = joiSchema.validate(req.body);
    if (error) return res.status(400).render('campground/error', { err: error });
    const data = await new cammod(req.body);
    await data.save();
    res.redirect('/');
  
  }));
  
  router.get('/:id/edit', catchError(async (req, res) => {
    const {id} = req.params;
    const camp = await cammod.findById(id);
    res.render('campground/edit.ejs', {camp});
  }));
  
  router.put('/:id', catchError(async (req, res) => {
    const { error } = joiSchema.validate(req.body);
    if (error) return res.status(400).render('campground/error', { err: error });
    const {id} = req.params;
    const camp = await cammod.findByIdAndUpdate(id,{...req.body});
    await camp.save();
    res.redirect(`//${id}`);
  }));
  
  router.delete('/:id', catchError(async (req, res) => {
  
    const {id} = req.params;
    await cammod.findByIdAndDelete(id);
    res.redirect('/');
  
  }));