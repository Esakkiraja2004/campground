module.exports.isLoggedIn = (req, res, next) => {
    console.log(`USER DATA: ${req.user ? JSON.stringify(req.user) : 'No user logged in'}`);

    // Use Passport's built-in method directly to check if the user is authenticated
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        req.flash('error', "You're not authenticated");
        return res.redirect('/login');
    }

    // If the user is authenticated, proceed to the next middleware or route handler
    next();
};
