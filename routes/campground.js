const express = require('express');
const router = express.Router();
const catchError = require('../utils/catchError');
const cammod = require('../models/schema');
const reviewSchema = require('../models/review');

const campground = require('../controllers/campground')


const {isLoggedIn} = require('../middleWare/loginMiddleWare');
const isAuthorized = require('../middleWare/isAuthor'); 

router.get('/',isLoggedIn, catchError(campground.index));

router.get('/newcamp',isLoggedIn , campground.newCampground  );

router.get('/:id', catchError(campground.getInfo));

router.post('/', isLoggedIn , catchError(campground.postNewCampground));

router.get('/:id/edit', isLoggedIn , isAuthorized ,  catchError(campground.editCampground));

router.put('/:id', isLoggedIn , isAuthorized ,  catchError(campground.putEditDetails));

router.delete('/:id', isLoggedIn , catchError(campground.deleteCampground));

module.exports = router;
