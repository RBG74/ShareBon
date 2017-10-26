var mongoose = require('mongoose');
var Log     = require('../models/log');
var jwt      = require('jsonwebtoken');
var config   = require('../config');

exports.read_all = function(req, res, next) {
  if(debug) console.log('[debug]logController, read_all');

  Log.find().populate('user', 'username isAdmin').exec(function(err, logs) {
    if(err){
      return next(err);
    }
    if(logs[0]){
      return res.json({success: true, logs});
    } else {
      return res.json({success: true, message: 'There is no log.'});
    }
  });
};

exports.read_one = function(req, res, next) {
  if(debug) console.log('[debug]logController, read_one');

  var id = req.params.id;
  if(mongoose.Types.ObjectId.isValid(id)){
    Log.findById(id).populate('user', 'username isAdmin').exec(function(err, log) {
      if(err){
        return next(err);
      }
      if(log){
        return res.json({success: true, log});
      } else {
        return res.json({success: true, message:'No log found with this id.'});
      }
    });
  } else {
    return res.json({sucess: false, message: 'Parameter needs to be an id.'});
  }
};

exports.read_by_user = function(req, res, next) {
  if(debug) console.log('[debug]logController, read_by_user');

  var userid = req.params.id;
  if(mongoose.Types.ObjectId.isValid(id)){
    Log.find({user: userid}).populate('user', 'username isAdmin').exec(function(err, logs) {
      if(err){
        return next(err);
      }
      if(logs[0]){
        return res.json({success: true, logs});
      } else {
        return res.json({success: true, message: 'There is no log for this user.'});
      }
    });
  } else {
    return res.json({sucess: false, message: 'Parameter needs to be an id.'});
  }
};

exports.delete_one = function(req, res, next) {
  if(debug) console.log('[debug]logController, delete_one');

  var id = req.params.id;
  if(mongoose.Types.ObjectId.isValid(id)){
    Log.findByIdAndRemove(id, function(err){
      if(err){
        return next(err);
      }
      return res.json({success: true, message: "The log was sucessfully deleted."});
    });
  } else {
    return res.json({sucess: false, message: 'Parameter needs to be an id.'});
  }
};

exports.delete_by_user = function(req, res, next) {
  if(debug) console.log('[debug]logController, delete_by_user');

  var userid = req.params.id;
  if(mongoose.Types.ObjectId.isValid(userid)){
    Log.remove({ 'user': userid }, function(err, removed){
      if(err){
        return next(err);
      } else {
        return res.json({ success: true, message: 'This user\'s logs were successfully deleted.', removed: removed.result.n });
      }
    });
  } else {
    return res.json({sucess: false, message: 'Parameter needs to be an id.'});
  }
};