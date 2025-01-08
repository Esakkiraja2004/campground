const express = require('express');
const router = express.Router({ mergeParams: true });
const catchError = require('../utils/catchError');
const reviewController = require('../controllers/review')

router.post('/', catchError(reviewController.addReview));

router.delete('/:reviewId', catchError(reviewController.deleteReview));
  

module.exports = router