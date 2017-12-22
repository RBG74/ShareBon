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
}).then(utility.initAdmin()); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use( "/assets/profilePictures", [ /*utility.isAuth,*/ express.static( __dirname + "/assets/profilePictures" ) ] );

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

var adverts = require('./routes/advertRoutes');
app.use('/adverts', adverts);

/* Error handling */
app.use(function(error, req, res, next) {
    if(error){
        res.status(error.status||500).send({ success: false, message: error.message });
        console.log("We no good:");
        console.log(error);
    } else {
        console.log("We good");
    }
});

var port = config.port;
app.listen(port, console.log('App successfully started!'));