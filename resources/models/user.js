const mongoose = require('mongoose');

const TradeOfferManager = require('steam-tradeoffer-manager');
const manager = require('../../config/steam');

const SteamCommunity = require('steamcommunity');
const community = new SteamCommunity();

const Item = require('./item');

var userSchema = mongoose.Schema({

    steamid: String,
    balance: Number,

    inventory: [{type: mongoose.Schema.Types.ObjectId, ref: 'Item'}]

});

userSchema.methods.getSteamProfile = function(cb){
    return community.getSteamUser(new SteamCommunity.SteamID(this.steamid), cb);
}

userSchema.methods.getSteamInventory = function(cb){
    this.getSteamProfile(function(err, user){
        user.getInventory('252490', 2, true, cb);

    });
}

userSchema.methods.sendTradeOffer = function(sendItems, cb){
    const offer = manager.createOffer(new SteamCommunity.SteamID(this.steamid));
    this.getSteamInventory(function(err, items){
        items.forEach(function(item){
            if(sendItems.indexOf(item.id) > -1) offer.addTheirItem(item);
        });
        offer.send(cb);    
    });

}


const User = mongoose.model('User', userSchema);

module.exports = User;