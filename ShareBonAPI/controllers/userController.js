var mongoose = require('mongoose');
var User     = require('../models/user');
var jwt      = require('jsonwebtoken');
var config   = require('../config');
var utility  = require('../utility');
var fs       = require('fs');

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
  if(typeof id !== 'undefined'){
    User.findById(id)
      .exec()
      .then(function(user) {
        if(user){
          return res.json({success: true, user});
        } 
        else {
          return res.json({success: true, user: null, message:'No user found with this id.'});
        }
      })
      .catch(function(error) {
        return next(error);
      });
  } 
  else {
    User.findOne({email: id})
      .exec()
      .then(function(user){
        if(user){
          return res.json({success: true, user});
        } 
        else {
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

  var targetId = mongoose.Types.ObjectId(req.params.id);
  User.findById(targetId).exec()
    .then(function(user) {
      if(user){
        var targetUser = user;
        var loggedUser = new User(req.decoded._doc);
        //Check if admin or if logged user = modification target
        if(loggedUser.isAdmin || loggedUser._id == targetUser._id){
          var isUpdated = false;
          
          if(typeof req.body.email !== 'undefined'){
            targetUser.email = req.body.email;
            isUpdated = true;
          }
          if(typeof req.body.firstName !== 'undefined'){
            targetUser.name.first = req.body.firstName;
            isUpdated = true;
          }
          if(typeof req.body.lastName !== 'undefined'){
            targetUser.name.last = req.body.lastName;
            isUpdated = true;
          }
          if(typeof req.body.password !== 'undefined'){
            targetUser.password = req.body.password;
            isUpdated = true;
          }
          if(typeof req.body.phoneCode !== 'undefined'){
            targetUser.phone.countryCode = req.body.phoneCode;
            isUpdated = true;
          }
          if(typeof req.body.phoneNumber !== 'undefined'){
            targetUser.phone.number = req.body.phoneNumber;
            isUpdated = true;
          }
          if(typeof req.body.minibio !== 'undefined'){
            targetUser.minibio = req.body.minibio;
            isUpdated = true;
          }

          if (req.files){
            var file = req.files.profilePicture;
            var a = file.name.split('.');
            var extension = '.' + a[a.length-1];
            var path = 'assets/profilePictures/' + targetUser._id + extension;
            fs.unlink(path, function(unlinkError) {
              if (unlinkError && unlinkError.errno != -4058)
                return next(unlinkError);
                  
              file.mv(path, function(moveError) {
                if (moveError)
                  return next(moveError);
                  targetUser.profilePictureUrl = config.host + path;
                isUpdated = true;

                if(isUpdated){
                  targetUser.isNew = false;
                  targetUser.save(function(error, user) {
                    if(error){
                      return next(error);
                    }
                    return res.json({success: true, message: 'The user was successfully changed.'});
                  });
                }
                else{
                  return res.json({success: true, message: 'The user wasn\'t updated, no useful data was provided.'});
                }
                
              });
            });
          }
        }
        else
        {
          return next(new Error('You can only update your own profile unless you have an admin token.'));
        }
      } 
      else {
        return res.json({success: true, user: null, message:'No user found with this id.'});
      }
    })
    .catch(function(error) {
      return next(error);
    });
};

exports.delete_one = function(req, res, next) {
  if(debug.user) console.log('[debug]userController, delete_one');

  var targetId = req.params.id;

  var loggedUser = new User(req.decoded._doc);
  //Check if admin or if logged user = modification target
  if(loggedUser.isAdmin || loggedUser._id == targetId){
    if(typeof targetId !== 'undefined'){
      User.findByIdAndRemove(targetId, function(error, user){
        if(error){
          return next(error);
        }
        var p = user.profilePictureUrl.replace(config.host, '');
        fs.unlink(p);
        return res.json({success: true, message: "The user was sucessfully deleted."});
      });
    } 
    else {
      return res.json({sucess: false, message: 'No valid id was provided.'});
    }
  }
  else{
    return res.json({success: true, message: 'The user wasn\'t updated, no useful data was provided.'});
  }
};


exports.authenticate = function(req, res, next) {
  if(debug.user) console.log('[debug]userController, authenticate');

  User.findOne(
    { email: req.body.email },
    function(error, user) {
      if(error){
        return next(error);
      }
      if(!user){
        return res.json({ success: false, message: 'Authentication failed. User not found.'});
      } 
      else {
        if(!user.validPassword(req.body.password)){
          return res.json({ success: false, message: 'Authentication failed. Wrong password.'});
        } 
        else {
          var token = jwt.sign(user, config.secret, {
            //expiresIn: 60*60*24 // expires in 24 hours
            expiresIn: 60*60*24 * 365 // expires in a year
          });
          return res.json({ success: true,  message: 'Your token is valid for the next 24 hours.', token });
        }
      }
  })
};