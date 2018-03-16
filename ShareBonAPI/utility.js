var jwt = require('jsonwebtoken');
var config   = require('./config');

var readToken = function(req, callback){
    if(debug.utility) console.log('[debug]utility, readToken');
    
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
        jwt.verify(token, config.secret, function(error, decoded){
            if(error){
                return callback(error);
            } else {
                return callback(null, decoded);
            }
        });
    } else {
        return callback(null, false);
    }
};

exports.isAuth = function(req, res, next){
    if(debug.utility) console.log('[debug]utility, isAuth');

    readToken(req, function(error, token){
        if(error){
            return next(error);
        } else if(!token){
            return res.status(403).send({ 
                success: false, 
                message: 'No token provided.'
            });
        } else {
            var User = require('./models/user');
            User.findOne({ 'email': token._doc.email }).exec()
            .then(function (user) {
                if(user == null){
                    return res.status(403).send({
                        success: false,
                        message: 'The user corresponding to this token has been deleted.'
                    });
                }
                else{
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
        }
    });
};

exports.isAdmin = function(req, res, next){
    if(debug.utility) console.log('[debug]utility, isAdmin');

    req.wantAdminToken = true;
    exports.isAuth(req, res, next);
};

exports.initAdmin = function(){
    if(debug.utility) console.log('[debug]utility, createAdmin');

    var User = require('./models/user');
    User.findOne({ 'email': config.admin.email })
        .exec()
        .then(function (admin) {
            if(!admin){
                new User({ 
                    email: config.admin.email,
                    name: {
                        first: config.admin.firstName,
                        last: config.admin.lastName
                    },
                    password: config.admin.password,
                    isAdmin: true 
                }).save(function(error) {
                    if(error){
                        throw error;
                    }
                    console.log('Admin user created.');
                });
            }
        })
        .catch(function(error){
            throw error;
        });
};

exports.handleLog = function(req, res, next){
    if(debug.utility) console.log('[debug]utility, handleLog');

    var Log = require('./models/log');

    readToken(req, function(error, token){
        var log = new Log({ method: req.method, route: req.url });
        if(token){
            log.user = token._doc._id;
        } else {
            log.user = null;
        }
        log.save(function(error){
            if(error){
                return next(error);
            }
            if(debug.utility) console.log('[debug]utility, handleLog, log saved');
            return next();
        });
    });
};