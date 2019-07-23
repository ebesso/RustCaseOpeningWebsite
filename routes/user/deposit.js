const express = require('express');
const router = express.Router()

const TradeOfferManager = require('steam-tradeoffer-manager');
const manager = new TradeOfferManager();

router.get('/user/deposit', function(req, res){
    req.user[0].getSteamInventory(function(items){
        res.render('user/deposit', {items: items});
    });

});

router.post('/user/deposit', function(req, res){

    req.user[0].sendTradeOffer(req.body.items, function(err, newOffer){
        if(err) res.send(`Failed to send trade offer (${err.message})`);
        else res.send('Trade offer has been sent');
    });

});

module.exports = router;