var mongoose = require('mongoose');
var Schema = mongoose.Schema;

advertSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    postDate: {
        type: Date,
        default: new Date()
    },
    picturesUrls: [{
        type: String
    }],
    portionNumber: {
        type: Number
    },
    portionPrice: {
        type: Number
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Advert', advertSchema);