const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const passport = require('passport');
// login page
router.get('/login',(req,res)=> res.render('login'));
// register page
router.get('/register',(req,res)=> res.render('register'));
//Register handle
router.post('/register',(req,res)=>{
   const{name,email,password,password2}= req.body;
   let errors = [];
   //check require fields
   if(!name || !email || !password || !password2){
       errors.push({msg:'please fill in all fields'});
   }
   if(password != password2){
       errors.push ({msg:'Password do not match'});
   }
   //check pass length
   if(password.length < 6){
       errors.push({msg:'Password should be at least 6 characters'});
   }
   if(errors.length > 0){
    res.render('register',{
        errors,
        name,
        email,
        password,
        password2
    })
   } else{
       //pass
        User.findOne ({email : email})
        .then(user =>{
            if(user){
                // exist
                errors.push({ msg :" Email is already registered"});
                
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });
                // hash 
                bcrypt.genSalt(10,(err,salt)=> 
                bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    if(err) throw err ;
                    // set pass to hash
                    newUser.password = hash;
                    // save
                    newUser.save()
                    .then(user =>{
                        req.flash('success_msg','You are now  registered and can login');
                        res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
                }))
            }
        });
   }
});


router.post('/login', (req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash: true
    })(req,res,next);
});


// logout
router.get('/logout', (req,res)=> {
    req.logout(),
    req.flash('success_msg','you are logout'),
    res.redirect('/users/login');
});
module.exports =router;