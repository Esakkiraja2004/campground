const mongoose = require('mongoose');

const campsch = new mongoose.Schema ({
    title : 'string',
    location : 'string',
    place: 'string',
    description:'string',
    image: 'string',
    price: 'number'
});

const cammod = new mongoose.model('camp',campsch)

module.exports = cammod