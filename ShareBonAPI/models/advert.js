var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var config   = require('../config');
var fs       = require('fs');

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

advertSchema.pre('remove', function(next) {
    var pictures = this.picturesUrls;
    for (var i = 0, len = pictures.length; i < len; i++) {
        var imagePath = pictures[i].replace(config.host, '');
        fs.unlink(imagePath, function(unlinkError) {
        if (unlinkError && unlinkError.errno != -4058)
            next(unlinkError);
        else
            next();
        });
    }
});

module.exports = mongoose.model('Advert', advertSchema);