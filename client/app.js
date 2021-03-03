const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const allRoutes = require('./routes/index');
const flash = require('connect-flash');
const session = require('express-session'); 
const cookieParser = require("cookie-parser");

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
    secret:'placeholder', 
    saveUninitialized: true, 
    resave: true
})); 
app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.username;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', allRoutes)
app.use((err, req, res, next) => {
    console.log(err)
    const {message, statusCode = 500} = err;
    if (!err.message) err.message = 'Oh No, Something went Wrong!'
    res.status(statusCode).render('error', {err});
})

const port = process.env.PORT || 3000;
app.listen(port, ()=> {
    console.log(`Serving on port ${port}`)
})