const express  = require('express');
const ejsMate = require('ejs-mate');
const catchError = require('./utils/catchError');
const expressError = require('./utils/expresserror')
const path = require('path');
const cammod = require('./models/schema');
const methodOverride = require('method-override')
const app = express();
const port = 3000;

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

app.get('/',(req, res) =>{
    res.render("index.ejs");
});

app.get('/campgrounds' ,catchError( async(req, res) =>{
    const camp = await cammod.find({});
    res.render('campground/camp' , { camp});
}));

app.get('/campgrounds/newcamp',(req, res) => {

  res.render('campground/new.ejs');

})

app.get('/campgrounds/:id' , catchError(async(req, res) =>{
    const {id} = req.params;
    const camp = await cammod.findById(id);
    res.render('campground/show.ejs' , { camp});
}));


app.post('/campgrounds', catchError(async (req, res) => {
  if(!req.body)throw new expressError('ooops', 404);
  const data = await new cammod(req.body);
  await data.save();
  res.redirect('/campgrounds');

}));

app.get('/campgrounds/:id/edit', catchError(async (req, res) => {
  const {id} = req.params;
  const camp = await cammod.findById(id);
  res.render('campground/edit.ejs', {camp});
}));

app.put('/campgrounds/:id', catchError(async (req, res) => {
  const {id} = req.params;
  const camp = await cammod.findByIdAndUpdate(id,{...req.body});
  await camp.save();
  res.redirect(`/campgrounds/${id}`);
  
}));

app.delete('/campgrounds/:id', catchError(async (req, res) => {

  const {id} = req.params;
  await cammod.findByIdAndDelete(id);
  res.redirect('/campgrounds');

}));

app.all("*", (req, res, next) => {

  next(new expressError('OOPS page not found!!',500));
});

app.use((err, req, res, next) =>{
  const{status = 500, message = 'somthing went worng!!!!!!'} = err;
  res.status(status).send(message);
});

app.listen(port , () =>{
    console.log('listening on port 3000');

});