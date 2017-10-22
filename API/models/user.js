var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

userSchema = new Schema({ 
    username: { type: String, required: true, unique: true }, 
    password: { type: String, required: true }, 
    isAdmin: { type: Boolean, default: false }
});

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

module.exports = mongoose.model('User', userSchema);