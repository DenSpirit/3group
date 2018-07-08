var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var debug = require('debug')('flapper-news:server');
var http = require('http');
var fs = require('fs');
var wav = require('wav');
//var ssw = require('./SocketServerWrite');

require('./server/libs/agenda');

// mongoose.connect("mongodb://192.168.14.81/test");
mongoose.connect("mongodb://localhost/test");

var routes = require('./server/routes/index');
var auth = require('./server/routes/auth');
var admin = require('./server/routes/admin');
var teacher = require('./server/routes/teacher');
var user = require('./server/routes/user');
var guest = require('./server/routes/guest');
var mdlwares = require('./server/libs/mdlwares');

var app = express();

var port = normalizePort(process.argv[2] || '3000');
app.set('port', port);

var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// view engine setup
app.set('views', path.join(__dirname, 'app'));
app.set('view engine', 'ejs');

//favicon
app.use(favicon(__dirname + '/app/assets/images/favicon.ico'));

require('./server/config/passport');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressSession({
    store: new MongoStore({
        url: "mongodb://localhost/passport"
    }),
    secret: 'SECRET', resave: false, saveUninitialized: false, rolling: true,
    cookie: {secure: false, maxAge: 24 * 60 * 60 * 1000}
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

//index
app.use('/', routes);

//static
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/app', express.static(__dirname + '/app/'));
app.use('/dist', express.static(__dirname + '/dist/'));
app.use('/temp', express.static(__dirname + '/temp/'));
app.use('/systemjs.config.js', express.static(__dirname + '/systemjs.config.js'));

//routes
app.post('/login', auth.login);
app.get('/logout', auth.logout);
app.use('/guest', guest);

app.use(mdlwares.isAuthenticated);

app.use('/admin', admin);
app.use('/teacher', teacher);
app.use('/user', user);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
