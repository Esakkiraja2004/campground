const cammod = require('../models/schema');
const cities = require('./cities');
const city = require('./cities');
const {descriptors,places} = require('./seedHelpers')
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

const sam = array => array[Math.floor(Math.random() *array.length)]
const sd = async () => {

    await cammod.deleteMany({});
    for(let i = 0; i <50;i++) {
        const ra = Math.floor(Math.random() *1000);
        const data = new cammod({
            title: `${cities[ra].city}`,
            location: `${cities[ra].state}`,
            place:`${sam(descriptors)} , ${sam(places)}`,
            price:`${ra}`,
            description:"The stars are my roof, the wilderness is my bedroom, and the campfire is my warmth",
            image: `https://loremflickr.com/320/240/${sam(descriptors)}`

        });
        await data.save();
    };
}

sd();