var mongoose = require('mongoose');
var Advert     = require('../models/advert');
var utility = require('../utility');

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
    for (var i = 0, len = arr.length; i < len; i++)
    {
      var file = files[i];
      var a = file.name.split('.');
      var extension = '.' + a[a.length-1];
      var path = 'assets/advertPictures/' + new_advert._id + '/' + i + extension;
      file.mv(path, function(error) {
        if (error)
          return next(error);
        new_advert.picturesUrls.push(config.host + path);
        new_advert.save(function(error, advert) {
            if(error){
              return next(error);
            }
            return res.json({success: true, message: "The advert was sucessfully created."});
        });
      });
    }
  }
};