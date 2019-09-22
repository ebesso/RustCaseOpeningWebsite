const express = require('express');
const router = express.Router();

const User = require('../resources/models/user');
const Case = require('../resources/models/case');

router.get('/', function(req, res){
    Case.getCasesWithItems(function(err, cases){
        if(req.user){
            req.user[0].getSteamProfile(function(err, profile){
                res.render('index', {
                    cases: cases,
                    profile: profile,
                    image: profile.getAvatarURL()
                });
            });
        }else{
            res.render('index', {cases: cases});
        }
    });
});

module.exports = router;