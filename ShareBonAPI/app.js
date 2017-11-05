var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');

var config = require('./config');
var utility = require('./utility');

debug = config.debug;

/* Database connection */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.database, {
    useMongoClient: true
});

//Initialise compte Admin
utility.createAdmin();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(fileUpload());

//Open to cross domain requests
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/* Routes */
var logs = require('./routes/logRoutes');
app.use('/logs', logs);

//Intercepts all request to log them
app.use(utility.handleLog);

var users = require('./routes/userRoutes');
app.use('/users', users);

/* Error handling */
app.use(function(err, req, res, next) {
    if(err){
        res.status(err.status||500).send({ success: false, message: err.message });
        console.log("We no good:");
        console.log(err);
    } else {
        console.log("We good");
    }
});

var port = process.env.PORT || 3000;
app.listen(port);