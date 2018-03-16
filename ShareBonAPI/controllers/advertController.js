var mongoose = require('mongoose');
var Advert   = require('../models/advert');
var User     = require('../models/user');
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
    var files = [];
    if(!Array.isArray(req.files.pictures))
      files.push(req.files.pictures);
    else
      files = req.files.pictures;
    var promises = [];
    for (var i = 0, len = files.length; i < len; i++)
    {
      var file = files[i];
      promises.push(pushFileToAdvert(file, i, new_advert));
    }

    Promise.all(promises)
      .then( function(data) {
        return saveAdvert(advert);
      })
      .catch(function(error) {
        return error;
      });

    Promise.all(promises).then( function() {
      new_advert.save(function(error, advert) {
        if(error)
          return next(error);
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

exports.read_one = function(req, res, next) {
  if(debug.advert) console.log('[debug]advertController, read_one');

  var id = req.params.id;
  if(typeof id !== 'undefined'){
    Advert.findById(id)
    .exec()
    .then(function(advert) {
      if(advert != null) {
        return res.json({success: true, advert});
      } else {
        return res.json({success: true, message:'No advert found with this id.'});
      }
    })
    .catch(function(error) {
        return next(error);
    });
  }
};

exports.update_one = function(req, res, next) {
  if(debug.advert) console.log('[debug]advertController, update_one');

  var loggedUser = new User(req.decoded._doc);
  var targetId = mongoose.Types.ObjectId(req.params.id);
  Advert.findById(targetId)
    .exec()
    .then(function(advert){
      if(advert)
      {
        if(loggedUser.isAdmin || advert.user.equals(loggedUser._id))
        {
          var isUpdated = false;
          if(typeof req.body.title !== 'undefined'){
            advert.title = req.body.title;
            isUpdated = true;
          }

          if(typeof req.body.description !== 'undefined'){
            advert.description = req.body.description;
            isUpdated = true;
          }

          if(typeof req.body.portionNumber !== 'undefined'){
            advert.portionNumber = req.body.portionNumber;
            isUpdated = true;
          }

          if(typeof req.body.portionPrice !== 'undefined'){
            advert.portionPrice = req.body.portionPrice;
            isUpdated = true;
          }
          
          var waitForFiles = false;
          if (req.files && req.files.pictures){
            isUpdated = true;
            waitForFiles = true;
            var currentFileNumber = advert.picturesUrls.length;
            var files = [];
            if(!Array.isArray(req.files.pictures))
              files.push(req.files.pictures);
            else
              files = req.files.pictures;
            var promises = [];
            for (var i = 0, len = files.length; i < len; i++)
            {
              var file = files[i];
              promises.push(pushFileToAdvert(file, currentFileNumber+i, advert));
            }
        
            Promise.all(promises)
            .then( function(data) {
              return saveAdvert(advert);
            })
            .catch(function(error) {
              return error;
            });
          }
          if(isUpdated){
            if(!waitForFiles)
              return saveAdvert(advert);
          }
          else{
            return res.json({success: true, message: 'The advert wasn\'t updated, no useful data was provided.'});
          }
        }
        else
        {
          return res.json({sucess: false, message: 'The advert wasn\'t updated successfully, you have to be logged as the user who created it or as admin.'});
        }
      }
      else
      {
        return res.json({sucess: false, message: 'No valid id was provided.'});
      }
    });
};

function saveAdvert(advert){
  advert.isNew = false;
  advert.save(function(error, advert) {
    if(error){
      return next(error);
    }
    return res.json({success: true, message: 'The advert was successfully changed.'});
  });
}

exports.delete_one = function(req, res, next) {
  if(debug.advert) console.log('[debug]advertController, delete_one');

  var targetId = req.params.id;
  var loggedUser = new User(req.decoded._doc);
  Advert.findById(targetId)
    .exec()
    .then(function(advert){
      if(advert)
      {
        if(loggedUser.isAdmin || advert.user.equals(loggedUser._id))
        {
          advert.remove(function(error){
            if(error)
              return next(error);
            return res.json({sucess: true, message: 'The advert was deleted successfully.'});
          });
        }
        else
        {
          return res.json({sucess: false, message: 'The advert wasn\'t deleted successfully, you have to be logged as the user who created it or as admin.'});
        }
      }
      else
      {
        return res.json({sucess: false, message: 'No valid id was provided.'});
      }
    });
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