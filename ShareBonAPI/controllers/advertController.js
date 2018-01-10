var mongoose = require('mongoose');
var Advert   = require('../models/advert');
var utility  = require('../utility');
var fs       = require('fs');
var config   = require('../config');

exports.create = function(req, res, next) {
  if(debug.advert) console.log('[debug]advertController, create');

  var new_advert = new Advert({
    title: req.body.title,
    description: req.body.description,
    portionNumber: req.body.portionNumber,
    portionPrice: req.body.portionPrice,
    user: req.decoded._doc._id
  });

  if (req.files && req.files.pictures){
    var files = req.files.pictures;
    var promises = [];
    for (var i = 0, len = files.length; i < len; i++)
    {
      var file = files[i];
      promises.push(pushFileToAdvert(file, i, new_advert));
    }

    Promise.all(promises).then( function() {
      new_advert.save(function(error, advert) {
        if(error){
          return next(error);
        }
        return res.json({success: true, message: "The advert was sucessfully created."});
      });
    });
  }
};

function pushFileToAdvert( file, i, advert){
  return new Promise(function(resolve, reject){
    var a = file.name.split('.');
    var extension = '.' + a[a.length-1];
    var extension = ".png";
    var path = 'assets/advertPictures/' + advert._id + '_' + i + extension;
    fs.unlink(path, function(unlinkError) {
      if (unlinkError && unlinkError.errno != -4058)
        reject(unlinkError);
      file.mv(path, function(error) {
        if (error)
          reject(error);
          advert.picturesUrls.push(config.host + path);
          resolve();
      });
    });
  });
}

exports.read_all = function(req, res, next) {
  if(debug.advert) console.log('[debug]advertController, read_all');

  Advert.find({})
    .exec()
    .then(function(adverts) {
      if(adverts.length > 0) {
        return res.json({success: true, adverts});
      } else {
        return res.json({success: true, message:'No advert found.'});
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
        fs.unlink(p, function(unlinkError) {
          if (unlinkError && unlinkError.errno != -4058)
            return next(unlinkError);
          else
            return res.json({success: true, message: "The user was sucessfully deleted."});
        });
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

exports.delete_all = function(req, res, next) {
  if(debug.user) console.log('[debug]advertController, delete_all');

  Advert.find({}, function(error, adverts){
    if(error){
      return next(error);
    }
    for (var i = 0, len = adverts.length; i < len; i++) {
      var advert = adverts[i];
      advert.remove(function(error){
        if(error)
          return next(error);
      });
    }

    return res.json({success: true, message: "The adverts were sucessfully deleted."});
  });
};