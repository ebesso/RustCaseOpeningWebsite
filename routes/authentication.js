const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/login', passport.authenticate('steam'), function (req, res) {
        
});

router.get('/login/return',
    passport.authenticate('steam', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    }
);

router.get('/logout', function(req, res){
    if(req.user){
        req.logout();
    }
    res.redirect('/');
});

module.exports = router;