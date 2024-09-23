const express = require('express');
const router = express.Router();
const catchError = require('../utils/catchError');
const userSchema = require('../models/user')

router.get('/', (req, res) => {
    res.render('campground/register')
});

router.post('/', catchError(async(req, res) => {
    try{
        const {email, username ,password} = req.body;
        const userData = await userSchema({email,username});
        const registerData = await userSchema.register(userData , password);
        req.flash('success','register success');
        res.redirect('/campgrounds');
    
    }catch(e) {
        res.redirect('/register');
        req.flash('error','please enter valid details !');
    }


}));


module.exports = router