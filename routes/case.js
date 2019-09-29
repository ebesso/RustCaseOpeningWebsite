const express = require('express');
const router = express();

const Case = require('../resources/models/case');
const User = require('../resources/models/user');

router.get('/case/get/:name', function(req, res){
    Case.getCaseWithItems(req.params.name, function(err, searchedCase){
        var itemList = [];

        var itemLoop = new Promise((resolve, reject) => {
            searchedCase.items.forEach(item => {
                for(var i = 0; i < item.chance; i++){
                    itemList.push(item);
                }
                if(itemList.length == 100) resolve();
            });
        });

        var randomizedList = [];

        var randomizeLoop = new Promise((resolve, reject) => {

            for(var i = 0; i < 100; i++){
                randomizedList.push(itemList[Math.floor(Math.random() * itemList.length)]);
            }

        });
        

        itemLoop.then(() => {
            if(req.user){
                req.user[0].getSteamProfile(function(err, profile){
    
                    res.render('case', {
                        case: searchedCase,
                        caseItems: randomizedList,
                        profile: profile,
                        image: profile.getAvatarURL()
                    });
                });
            }else{
                res.render('case', {case: searchedCase, caseItems: randomizedList});
            }
    
        });


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

                searchedCase.open(req.user[0], function(err, item){
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