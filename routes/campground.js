const express = require('express');
const router = express.Router();
const catchError = require('../utils/catchError');


const campgroundController = require('../controllers/campground')


const {isLoggedIn} = require('../middleWare/loginMiddleWare');
const isAuthorized = require('../middleWare/isAuthor'); 

// =========================
// Campground Routes
// =========================

// Root: View all campgrounds & create a new campground
router.route('/')
    .get(isLoggedIn, catchError(campgroundController.index))            // GET: List all campgrounds
    .post(isLoggedIn, catchError(campgroundController.postNewCampground)); // POST: Create new campground

// New Campground: Form to create a new campground
router.route('/newcamp')
    .get(isLoggedIn, campgroundController.newCampground);               // GET: New campground form

// Specific Campground: View details, edit, or delete
router.route('/:id')
    .get(catchError(campgroundController.getInfo))                      // GET: View specific campground
    .put(isLoggedIn, isAuthorized, catchError(campgroundController.putEditDetails)) // PUT: Submit edits
    .delete(isLoggedIn, catchError(campgroundController.deleteCampground)); // DELETE: Remove campground

// Edit Campground: Form to edit a specific campground
router.route('/:id/edit')
    .get(isLoggedIn, isAuthorized, catchError(campgroundController.editCampground)); // GET: Edit form


module.exports = router;
