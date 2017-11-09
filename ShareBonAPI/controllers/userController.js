var mongoose = require('mongoose');
var User     = require('../models/user');
var jwt      = require('jsonwebtoken');
var config   = require('../config');

exports.create = function(req, res, next) {
  if(debug.user) console.log('[debug]userController, create');

  var new_user = new User({
    email: req.body.email,
    name: {
      first: req.body.firstName,
      last: req.body.lastName
    },
    password: req.body.password,
    phone: {
      countryCode: req.body.phoneCode,
      number: req.body.phoneNumber
    },
    minibio: req.body.minibio,
    isAdmin: false
  });
  if (req.files){
    var file = req.files.profilePicture;
    var a = file.name.split('.');
    var extension = '.' + a[a.length-1];
    var path = 'assets/profilePictures/' + new_user._id + extension;
    file.mv(path, function(error) {
      if (error)
        return next(error);
      new_user.profilePictureUrl = config.host + path;
      new_user.save(function(error, user) {
        if(error){
          return next(error);
        }
        return res.json({success: true, message: "The user was sucessfully created."});
    });
    });
  }
};

exports.read_all = function(req, res, next) {
  if(debug.user) console.log('[debug]userController, read_all');

  User.find({})
    .exec()
    .then(function(users) {
      if(users.length > 0) {
        return res.json({success: true, users});
      } else {
        return res.json({success: true, message:'No user found.'});
      }
    })
    .catch(function(error) {
        return next(error);
    });
};

exports.read_one = function(req, res, next) {
  if(debug.user) console.log('[debug]userController, read_one');

  var id = req.params.id;
  if(mongoose.Types.ObjectId.isValid(id)){
    User.findById(id)
      .exec()
      .then(function(user) {
        if(user){
          return res.json({success: true, user});
        } else {
          return res.json({success: true, user: null, message:'No user found with this id.'});
        }
      })
      .catch(function(error) {
        return next(error);
      });
  } else {
    User.findOne({email: id})
      .exec()
      .then(function(user){
        if(user){
          return res.json({success: true, user});
        } else {
          return res.json({success: true, message:'No user found with this email.'});
        }
      })
      .catch(function(error){
        return next(error);
      });
  }
};

exports.update_one = function(req, res, next) {
  if(debug.user) console.log('[debug]userController, update_one');
  
  var id = req.params.id;
  //Check if admin or if logged user = modification target
  if(utility.isAdmin || req.decoded._doc._id == id){
    //TODO
  }
  else
  {
    return next(new Error('You can only update your profile unless you have an admin token.'));
  }
  /*if(typeof req.params.newpassword !== 'undefined'){
    var new_password = req.params.newpassword;
  } else {
    return next(new Error('The \'newpassword\' parameter is required.'));
  }

  var user = new User(req.decoded._doc);
  user.password = new_password;
  user.isNew = false;

  user.save(function(error, user) {
    if(error){
      return next(error);
    }
    return res.json({success: true, message: 'The password was successfully changed.'});
  });*/
};

exports.delete_one = function(req, res, next) {
  if(debug.user) console.log('[debug]userController, delete_one');

  var id = req.params.id;
  if(mongoose.Types.ObjectId.isValid(id)){
    User.findByIdAndRemove(id, function(error,data){
      if(error){
        return next(error);
      }
      return res.json({success: true, message: "The user was sucessfully deleted."});
    });
  } else {
    return res.json({sucess: false, message: 'Parameter needs to be an id.'});
  }
};


exports.authenticate = function(req, res, next) {
  if(debug.user) console.log('[debug]userController, authenticate');

  User.findOne(
    { username: req.body.username },
    function(error, user) {
      if(error){
        return next(error);
      }
      if(!user){
        return res.json({ success: false, message: 'Authentication failed. User not found.'});
      } else {

        if(!user.validPassword(req.body.password)){
          return res.json({ success: false, message: 'Authentication failed. Wrong password.'});
        } else {
          var token = jwt.sign(user, config.secret, {
            //expiresIn: 60*60*24 // expires in 24 hours
            expiresIn: 60*60*24 * 365 // expires in a year
          });
          return res.json({ success: true,  message: 'Your token is valid for the next 24 hours.', token });
        }
      }
  })
};