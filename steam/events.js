const manager = require('./steam');

const User = require('../resources/models/user');
const Trade = require('../resources/models/trade');


manager.on('sentOfferChanged', function(offer, oldstate){
    console.log(`Trade offer changed from state ${oldstate} to ${offer.state}`);

    User.findOne({steamid: '76561198128942733'}, function(err, user){
        if(err)console.log(err.message);
        else console.log(user);
        Trade.findOne({id: offer.id}, function(err, trade){
            console.log(`Found active trade`);
            Trade.tradeOfferChanged(offer, user);
        });
    });
});