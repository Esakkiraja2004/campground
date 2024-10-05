module.exports.isLoggedIn = (req, res, next) => {
    // Example of how you might define isAuthenticated()
    const isAuthenticated = () => {
        return req.isAuthenticated && req.isAuthenticated(); // Assuming you're using Passport.js
    };

    if (!isAuthenticated()) {
        req.flash('error', "You're not authenticated");
        return res.redirect('/login');
    }
    next();
};
