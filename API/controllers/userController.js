var mongoose = require('mongoose');
var User     = require('../models/user');
var jwt      = require('jsonwebtoken');
var config   = require('../config');

exports.create = function(req, res, next) {
  if(debug) console.log('[debug]userController, create');

  var new_user = new User(req.body);
  new_user.isAdmin = false;
  new_user.save(function(err, user) {
      if(err){
        return next(err);
      }
      return res.json({success: true, message: "The user was sucessfully created."});
  });
};

exports.read_all = function(req, res, next) {
  if(debug) console.log('[debug]userController, read_all');

  User.find({}, function(err, users) {
    if(err){
      return next(err);
    }
    if(users[0]){
      return res.json({success: true, users});
    } else {
      return res.json({success: true, message:'No user found.'});
    }
  });
};

exports.read_one = function(req, res, next) {
  if(debug) console.log('[debug]userController, read_one');

  var id = req.params.id;
  if(mongoose.Types.ObjectId.isValid(id)){
    User.findById(id, function(err, user) {
      if(err){
        return next(err);
      }
      if(user){
        return res.json({success: true, user});
      } else {
        return res.json({success: true, user: null, message:'No user found with this id.'});
      }
    });
  } else {
    User.findOne({username: id}, function(err, user){
      if(err){
        return next(err);
      }
      if(user){
        return res.json({success: true, user});
      } else {
        return res.json({success: true, message:'No user found with this username.'});
      }
    });
  }
};

exports.update_password = function(req, res, next) {
  if(debug) console.log('[debug]logController, update_password');

  if(typeof req.params.newpassword !== 'undefined'){
    var new_password = req.params.newpassword;
  } else {
    return next(new Error('The \'newpassword\' parameter is required.'));
  }

  var user = new User(req.decoded._doc);
  user.password = new_password;
  user.isNew = false;

  user.save(function(err, user) {
    if(err){
      return next(err);
    }
    return res.json({success: true, message: 'The password was successfully changed.'});
  });
};

exports.delete_one = function(req, res, next) {
  if(debug) console.log('[debug]userController, delete_one');

  var id = req.params.id;
  if(mongoose.Types.ObjectId.isValid(id)){
    User.findByIdAndRemove(id, function(err,data){
      if(err){
        return next(err);
      }
      return res.json({success: true, message: "The user was sucessfully deleted."});
    });
  } else {
    return res.json({sucess: false, message: 'Parameter needs to be an id.'});
  }
};


exports.authenticate = function(req, res, next) {
  if(debug) console.log('[debug]userController, authenticate');

  User.findOne(
    { username: req.body.username },
    function(err, user) {
      if(err){
        return next(err);
      }
      if(!user){
        return res.json({ success: false, message: 'Authentication failed. User not found.'});
      } else {

        if(!user.validPassword(req.body.password)){
          return res.json({ success: false, message: 'Authentication failed. Wrong password.'});
        } else {
          var token = jwt.sign(user, config.secret, {
            expiresIn: 60*60*24 // expires in 24 hours
          });
          return res.json({ success: true,  message: 'Your token is valid for the next 24 hours.', token });
        }
      }
  })
};