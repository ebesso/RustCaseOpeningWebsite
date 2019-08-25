const express = require('express');
const router = express.Router();

const User = require('../../resources/models/user');

router.get('/user/profile', function(req, res){
    req.user[0].getSteamProfile(function(err, profile){

        if(err) res.send('Failed to get profile');
        else{
            req.user[0].getInventory(function(err, inventory){

                if(err) res.send('Failed to load inventory');
                else{
                    req.user[0].getCaseHistory(function(err, history){

                        if(err) res.send('Failed to load history');
                        else{

                            res.render('user/profile', {
                                
                                image: profile.getAvatarURL(),
                                profile: profile,
                                inventory: inventory.inventory,
                                history: history

                            });

                        }

                    });
                }

            });
        }

    });

});


module.exports = router;