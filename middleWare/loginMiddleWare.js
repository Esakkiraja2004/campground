module.exports.isLoggedIn = (req, res, next) => {
    if (!isAuthenticated()) {
        req.flash('error', "You're not authenticated");
        return res.redirect('/login');
    }
    next();
};
