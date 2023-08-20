const express = require('express');
const app = express();
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const {sessionKeySecret} = require('./config');
const helmet = require('helmet')
const rareLimiter = require('../app/middleware/rare-limiter-middleware');

//init database
require('./db/mongoose')
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'" , "cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'" , "cdn.jsdelivr.net"]
        }
    }
}))
//sesion - middleware
app.use(session({
    secret: sessionKeySecret, 
    saveUninitialized: true,  //Czy ma sie usunac po odswiezeniu np, true - nie usunie sie / false - usunie sie
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 dzien
    resave: false,
}))
app.use(rareLimiter)
//ustawienie silnika do tworzenia html
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/../views'))
//ustawienie layoutu
app.use(ejsLayouts);
app.set('layout', 'layouts/main.ejs');

//public folder
app.use(express.static('public'))

//middleware
//Gdy chcemy do wszystkich można tak:
app.use(require('./middleware/view-variables-middleware.js'))
app.use(require('./middleware/user-middleware.js'))
app.use('/admin',require('./middleware/is-auth-middleware'))
// lub
// app.use('/',  require('./middleware/view-variables.js') )
//Gdy chcemy do danej sciezki: 
// app.use('/firmy', require('./middleware/view-variables.js') )

//Next w każdym middlewarze mowi zeby przeszedl do kolejnego, wiec jak bedzie ich 5 to kazdy sie pokolei wykona i dopiero pojdzie do routingu
//MIDDLEWARE ZAWSZE PRZED ROUTINGIEM

//bodyParsers // aplication/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); 
//Jezeli skorzystalibysmy z API to wtedy inny parser trzeba uzyc // application/json

//cookie parses
app.use(cookieParser());


//parser dla JSON
app.use(express.json());

//pobieranie routingow
app.use('/api',require('../app/routes/api'))
app.use(require('../app/routes/web'))

module.exports = app
