const express = require('express');
const ejsMate = require('ejs-mate');
const expressError = require('./utils/expresserror');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

const campgroundsRoutes = require('./routes/campground');

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
app.use(express.static(path.join(__dirname, 'public')));

app.use('/campgrounds', campgroundsRoutes);

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
