const express = require('express');
const expressLayouts = require('express-ejs-layouts');


const app =express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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

const swaggerOptions={
  swaggerDefinition: {
      info: {
          title: 'My name',
          description: "Nguyễn Công Phương Nam",
          version: "1.0.0",
          contact: {
              name: "Nguyễn Công Phương Nam",
              email: "17520778@gm.edu.vn",
          },
          servers: ["localhost:9001"]
      }
  },
  apis: ["app.js"]
};
const swaggerDocs=swaggerJsDoc(swaggerOptions);
app.use('/apidocs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /:
 *  get:
 *    description: Use to request all student
 *    responses:
 *      '200':
 *        description: A successful request
 * /users/login:
 *   post:
 *    description: Login
 *    parameters:
 *    - name: email
 *      description: User Email
 *      in: formData
 *      required: true
 *      type: string
 *    - name: password
 *      description: User Password
 *      in: formData
 *      required: true
 *      type: string
 *    responses:
 *      '200':
 *        description: login success
 */