const express = require('express');
const router = express.Router()

const TradeOfferManager = require('steam-tradeoffer-manager');
const manager = new TradeOfferManager();

router.get('/deposit', function(req, res){
    req.user[0].getSteamInventory(function(err, items, currencies){
        res.render('user/deposit', {items: items});
    });

});

router.post('/deposit', function(req, res){

    req.user[0].sendTradeOffer(req.body.items, function(err, status){
        if(err) res.send(`Failed to send trade offer (${err.message})`);
        else res.send('Trade offer has been sent');
    });

});

module.exports = router;