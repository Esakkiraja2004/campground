const express = require('express');
const router = express.Router();
const catchError = require('../utils/catchError');
const registerController = require('../controllers/register')

// =========================
// User Authentication Routes
// =========================

// Register Routes
router.route('/register')
    .get(registerController.renderRegisterpage)            // GET: Render register page
    .post(catchError(registerController.registerNewUser)); // POST: Register a new user

// Login Routes
router.route('/login')
    .get(registerController.renderLoginPage)               // GET: Render login page
    .post(registerController.login);                       // POST: Log in the user

// Logout Route
router.get('/logout', registerController.logout);          // GET: Log out the user


module.exports = router