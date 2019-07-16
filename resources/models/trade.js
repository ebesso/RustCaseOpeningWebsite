const mongoose = require('mongoose');

const TradeOfferManager = require('steam-tradeoffer-manager');
const manager = require('../../steam/steam');

const Item = require('./item');
const User = require('./user');

var tradeSchema = mongoose.Schema({

    id: String,
    partner: String,
    active: Boolean,
    type: String
    
});

tradeSchema.methods.calculateOfferValue = function(cb){
    var offer = this;
    manager.getOffer(this.id, function(err, steamOffer){
        var value = 0;
        var loop = new Promise((resolve, reject) => {

            if(offer.type == 'deposit'){
                steamOffer.itemsToReceive.forEach(function(item, i){
                    Item.findOne({name: item.market_hash_name}, function(err, info){
                        value += Number(info.price);
                        if(i == (steamOffer.itemsToReceive.length - 1)) resolve();
                    });
                });
            }

        });
        loop.then(() => {

            console.log(`Offer value is ${value}`);
            return cb(Number(value));

        });

    });
}

tradeSchema.methods.moreInfo = function(cb){
    manager.getOffer(this.is, cb);
}

tradeSchema.methods.acceptedTradeOffer = function(user, cb){
    var offer = this;

    if(offer.type == 'deposit'){
        this.calculateOfferValue(function(value){
            user.addBalance(value, function(err, resp){
                if(err)console.log(err.message);
                Trade.updateOne({id: offer.id}, {active: false}, function(err, resp){
                    if(err)console.log(err.message);
                    return cb();                
                });
            });
        });

    }
}

tradeSchema.methods.declineTradeOffer = function(offer){
    offer.cancel(function(err){
        console.log('Trade offer has been canceled');
        Trade.updateOne({id: offer.id}, {active: false}, function(err, resp){
            if(err) console.log(err.message);
            else console.log('Trade is no longer active');  
        });
    });
}

tradeSchema.statics.allTradesBySteamid = function(steamid, cb){
    return this.find({partner: steamid}, cb);
}

tradeSchema.statics.tradeOfferChanged = function(offer, user){
    this.findOne({id: offer.id, active: true}, function(err, storedOffer){
        if(offer.state != TradeOfferManager.ETradeOfferState.Active){
            console.log('Trade offer is active');
            if(offer.state == TradeOfferManager.ETradeOfferState.Accepted){
                storedOffer.acceptedTradeOffer(user, function(){
                    console.log('Trade offer accepted');
                });
            }
            else storedOffer.declineTradeOffer(offer);
        }
        
    });
}

tradeSchema.statics.createDepositOffer = function(offerid, steamid, cb){

    this.create({

        id: offerid,
        partner: steamid,
        active: true,
        type: 'deposit'

    }, cb);

}

const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;
