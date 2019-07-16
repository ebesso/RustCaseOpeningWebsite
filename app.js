const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/george', {useNewUrlParser: true});
const db = mongoose.connection;

const express = require('express');
const exphbs = require('express-handlebars')

const app = express();
const port = 5000;

app.use(express.static('static'));

const http = require('http').createServer(app);
const io = require('socket.io')(http);

const passport = require('passport');

require('./config/passport')(passport);

require('./steam/steam');
require('./steam/events');


var session = require('express-session');

var sessionMiddleware = session({
    secret: '123', 
    store: new (require('connect-mongo')(session))({
        url: 'mongodb://localhost/james'
    }),
    resave: false,
    saveUninitialized: true
});
io.use(function(socket, next){
    sessionMiddleware(socket.request, {}, next);
});

app.use(express.json());

//Passport middleware
app.use(require('serve-static')(__dirname + '/../../public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(sessionMiddleware)
app.use(passport.initialize());
app.use(passport.session());

const hbs = exphbs.create({

    defaultLayout: 'main',
    extname: '.hbs',
    partialsDir: __dirname + '/views/partials', 

    helpers: {

        getBalance: function(user){
            return user[0].balance;
        }

    }

});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

db.once('open', function(){
    console.log('Connected to database');
});

app.use(function (req, res, next) {
    if(req.user)res.locals.user = req.user;
    next();
});

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use(require('./routes/admin/admin'));
app.use(require('./routes/user/user'));


//Events
require('./socket/events')(io);

http.listen(port);
