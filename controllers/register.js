const userSchema = require('../models/user')
const passport = require('passport');

module.exports.renderRegisterpage =  (req, res) => {
    res.render('campground/register')
}

module.exports.registerNewUser = async(req, res) => {
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
}

module.exports.renderLoginPage = (req, res) => {
    res.render('campground/login');
}

module.exports.login = passport.authenticate('local', {successRedirect: '/campgrounds',failureRedirect: '/login',failureFlash: true }) ,(req,res) => {
    req.flash('success','Successfully logged in')
    res.redirect('/campgrounds');
}

module.exports.logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'You have been logged out'); // Optional: set flash message
        res.redirect('/login');
    });
}