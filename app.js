const express = require('express');
const expressLayouts = require('express-ejs-layouts');


const app =express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

require('./passport')((passport));
// DB config
const db = require('./key').MongoURL;
// Connect to Mongo

//ejs
app.use(expressLayouts);
app.set('view engine','ejs');
//bodyparser
app.use(express.urlencoded({ extended: false}))

//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));
  //passport
  app.use(passport.initialize());
  app.use(passport.session());


app.use(flash());

//
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
//routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
const PORT = process.env.PORT || 9001;
app.listen(PORT,console.log(`Server started on port ${PORT}`));

mongoose.connect(db, {useNewUrlParser: true})
.then(()=> console.log('MongoDB Connect...'))
.catch(err => console.log(err));
