const mongoose = require('mongoose');
const review = require('./review'); // Assuming 'review' exports the Review model, not the schema

const campSchema = new mongoose.Schema({
    title: 'string',
    location: 'string',
    place: 'string',
    description: 'string',
    image: 'string',
    price: 'number',
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'review' // Ensure this matches the model name
    }]
});

campSchema.post('findOneAndDelete', async (docs) => {
    if (docs) {
        await review.deleteMany({
            _id: {
                $in: docs.reviews
            }
        });
    }
});

const Camp = mongoose.model('Camp', campSchema);

module.exports = Camp;
