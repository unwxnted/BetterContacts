const express = require('express');
const passport = require('passport');
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/helpers');
const router = express.Router();


router.get('/signup', isNotLoggedIn,(req, res) =>{
    res.render('contacts/signup');
});


router.get('/signin', isNotLoggedIn,(req, res)  =>{
    res.render('contacts/signin');
});

router.post('/signin',async (req, res, next) =>{

    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true,
        successFlash: true
    })(req, res, next);

});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true,
    successFlash: true
}));

router.get('/profile', isLoggedIn,(req, res) =>{
    res.render('contacts/profile');
});

router.get('/logout', isLoggedIn,(req, res) =>{
    req.logout(req.user, err => {
        if(err) return next(err);
        res.redirect("/signin");
    });
})

module.exports = router;