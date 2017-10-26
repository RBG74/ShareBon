var jwt = require('jsonwebtoken');
var config   = require('./config');

/* callback(err, (decodedToken)) */
var readToken = function(req, callback){
    if(debug) console.log('[debug]utility, readToken');
    
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
        jwt.verify(token, config.secret, function(err, decoded){
            if(err){
                return callback(err);
            } else {
                return callback(null, decoded);
            }
        });
    } else {
        return callback(null, false);
    }
};

exports.isAuth = function(req, res, next){
    if(debug) console.log('[debug]utility, isAuth');

    readToken(req, function(err, token){
        if(err){
            return next(err);
        } else if(!token){
            return res.status(403).send({ 
                success: false, 
                message: 'No token provided.'
            });
        } else {
            //We have a token, do we need an admin?
            if(!req.wantAdminToken){
                //We just need a token, let them pass
                req.decoded = token;
                return next();
            } else {
                if(token._doc.isAdmin){
                    req.decoded = token;
                    return next();
                } else {
                    return res.status(403).send({
                        success: false,
                        message: 'You need an admin token.'
                    });
                }
            }
        }
    });
};

exports.isAdmin = function(req, res, next){
    if(debug) console.log('[debug]utility, isAdmin');

    req.wantAdminToken = true;
    exports.isAuth(req, res, next);
};

exports.createAdmin = function(){
    if(debug) console.log('[debug]utility, createAdmin');

    var User = require('./models/user');
    User.findOne({ 'username': 'Admin' }, function (err, admin) {
        if(err){
            return next(err);
        } 
        if(!admin){
            new User({ 
                username: config.adminLogin, 
                password: config.adminPassword,
                isAdmin: true 
            }).save(function(err) {
                if (err) throw err;
            });
        }
    });
};

exports.handleLog = function(req, res, next){
    if(debug) console.log('[debug]utility, handleLog');

    var Log = require('./models/log');

    readToken(req, function(err, token){
        var log = new Log({ method: req.method, route: req.url });
        if(token){
            log.user = token._doc._id;
        } else {
            log.user = null;
        }
        log.save(function(err){
            if(err){
                return next(err);
            }
            if(debug) console.log('[debug]utility, handleLog, log saved');
            return next();
        });
    });
};