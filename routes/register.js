const express = require('express');
const router = express.Router();
const catchError = require('../utils/catchError');
const userSchema = require('../models/user')
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('campground/register')
});

router.post('/register', catchError(async(req, res) => {
    try{
        const {email, username ,password} = req.body;
        const userData = await userSchema({email,username});
        const registerData = await userSchema.register(userData , password);
        req.flash('success','register success');
        res.redirect('/campgrounds');
    
    }catch(e) {
        req.flash('error','please enter valid details !');
        res.redirect('/register');

    }
}));

router.get('/login',(req, res) => {
    res.render('campground/login');
});

router.post('/login', passport.authenticate('local', {failureFlash : true , failureRedirect : '/login'}) ,(req,res) => {
    req.flash('success','Successfully logged in')
    res.redirect('/campgrounds');
});

module.exports = router