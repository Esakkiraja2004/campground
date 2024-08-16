const express  = require('express');
const ejsMate = require('ejs-mate');
const catchError = require('./utils/catchError');
const expressError = require('./utils/expresserror')
const joi  = require('joi');
const path = require('path');
const cammod = require('./models/schema');
const reviewSchema = require('./models/review');
const methodOverride = require('method-override')
const app = express();
const port = 3000;
const campgroundRoute = require('./routes/campground');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'))

// Import mongoose module
const mongoose = require('mongoose');

// Define your MongoDB URI
const mongoURI = 'mongodb://localhost:27017/campground';

// Function to connect to the database
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true,});
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

// Call the connectDB function
connectDB();

app.engine('ejs' , ejsMate)
app.set('view engine','ejs');
app.set('views' , path.join(__dirname, 'view'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('camgrrounds',campgroundRoute);


app.all("*", (req, res, next) => {

  next(new expressError('OOPS page not found!!',404));
});

app.use((err, req, res, next) =>{
  const{status = 500} = err;
  if(!err.message) err.message ="oops somthing went wrong!!!"
  res.status(status).render('campground/error', {err});
});

app.listen(port , () =>{
    console.log('listening on port 3000');

});