const mongoose = require('mongoose');

const TradeOfferManager = require('steam-tradeoffer-manager')
const manager = new TradeOfferManager();

var tradeSchema = mongoose.Schema({

    id: String
    
});

tradeSchema.methods.moreInfo = function(cb){
    manager.getOffer(this.is, cb);
}

tradeSchema.statics.allTradesBySteamid = function(steamid, cb){
    return this.find({partner: steamid}, cb);
}

const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;
