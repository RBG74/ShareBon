var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        _id: false,
        first: {
            type: String,
            required: true
        },
        last: {
            type: String,
            required: true
        }
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    phone: {
        _id: false,
        countryCode: String,
        number: String
    },
    minibio: {
        type: String
    },
    profilePictureUrl: {
        type: String
    }
});

/* Validations */
userSchema.path('email').validate(function (email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
 }, 'The email field is either incorrect or empty.')

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

userSchema.pre('save', function(next) {
    this.password = this.encryptPassword(this.password);
    next();
});

/*
userSchema.post('find', function(users) {
    for(var i=0, l=users.length; i<l; i++){
        var user = users[i];
        if(typeof user.profilePictureUrl !== 'undefined')
            user.profilePictureUrl = config.host + user.profilePictureUrl
    };
});*/


module.exports = mongoose.model('User', userSchema);