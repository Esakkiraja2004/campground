const express = require('express');
const router = express.Router();
const catchError = require('../utils/catchError');
const userSchema = require('../models/user')

router.get('/', (req, res) => {
    res.render('campground/register')
});

module.exports = router