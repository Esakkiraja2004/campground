const express = require('express');
const ejsMate = require('ejs-mate');
const expressError = require('./utils/expresserror');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const passport  = require('passport');
const localStratagy = require('passport-local');
const userSchema = require('./models/user')
const port = 3000;

const session = require('express-session');
const flash = require('connect-flash');

// Set up session middleware
app.use(session({
  secret: 'thisIsVerySecret', // Replace with your own secret key
  resave: false,
}));

// Set up flash middleware
app.use(flash());

// Set up a middleware to make flash messages available to all views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  res.locals.review_msg = req.flash('review');
  res.locals.update_msg = req.flash('update');
  next();
});


const campgroundsRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/review');
const registerRoutes = require('./routes/register');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

const mongoURI = 'mongodb://localhost:27017/campground';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

connectDB();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

app.use(passport.initialize());
app.use(passport.session());
passport.use( new localStratagy(userSchema.authenticate()));

passport.serializeUser(userSchema.serializeUser());
passport.deserializeUser(userSchema.deserializeUser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/review',reviewRoutes )
app.use('/',registerRoutes)

// app.get('/register', async (req, res) => {
//   const user = new userSchema({email:"ertyu", username: "fghjkl"})
//   const newUser = await userSchema.register(user,'hello')
//   res.send(newUser)
  
// });



app.all("*", (req, res, next) => {
  next(new expressError('OOPS page not found!!', 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "oops somthing went wrong!!!";
  res.status(status).render('campground/error', { err });
});

app.listen(port, () => {
  console.log('listening on port 3000');
});
