const express = require('express');
const router = express();

const Case = require('../resources/models/case');
const User = require('../resources/models/user');

router.get('/case/get/:name', function(req, res){
    Case.getCaseWithItems(req.params.name, function(err, searchedCase){
        if(req.user){
            req.user[0].getSteamProfile(function(err, profile){
                res.render('case', {
                    case: searchedCase,
                    profile: profile,
                    image: profile.getAvatarURL()
                });
            });
        }else{
            res.render('case', {case: searchedCase})
        }

    });
});

router.post('/case/open/:name', function(req, res){

    if(req.user){

        Case.getCaseWithItems(req.params.name, function(err, searchedCase){

            if(err){
                res.send({

                    success: false,
                    message: err.message
                });
            }else{

                searchedCase.open(req.user[0].steamid, function(err, item){
                    if(err){
                        res.send({
                            success: false,
                            message: err.message
                        });
                    }else{
                        res.send({

                            success: true,
                            item: item

                        });
                    }

                });

            }

        });

    }else{
        res.send({
            success: false,
            message: 'Login first'
        })
    }

});

module.exports = router;