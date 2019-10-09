const mongoose = require('mongoose');

const TradeOfferManager = require('steam-tradeoffer-manager');
const manager = require('../../steam/steam');

const SteamCommunity = require('steamcommunity');
const community = new SteamCommunity();

const Item = require('./item');
const Trade = require('./trade');
const CaseHistory = require('./caseHistory');

var userSchema = mongoose.Schema({

    steamid: String,
    balance: Number,

    inventory: [{type: mongoose.Schema.Types.ObjectId, ref: 'Item'}]

});

userSchema.methods.addBalance = function(amount, cb){
    return User.updateOne({steamid: this.steamid}, {balance: this.balance + amount}, cb);
}

userSchema.methods.getSteamProfile = function(cb){
    return community.getSteamUser(new SteamCommunity.SteamID(this.steamid), cb);
}

userSchema.methods.getSteamInventory = function(cb){
    this.getSteamProfile(function(err, user){
        user.getInventory('252490', 2, true, function(user, items, currencies){
            var inventory = []

            var loop = new Promise((resolve, reject) => {

                items.forEach(function(item){

                    Item.findOne({name: item.market_hash_name}, function(err, info){
                        if(err) console.log(err.message);

                        inventory.push({

                            info: item,
                            price: info.price

                        });

                        if(inventory.length == items.length) resolve();

                    });

                });

            });

            loop.then(() => {

                return cb(inventory);

            });

        });

    });
}

userSchema.methods.sendTradeOffer = function(sendItems, cb){
    var steamid = this.steamid;
    const offer = manager.createOffer(new SteamCommunity.SteamID(this.steamid));
    this.getSteamInventory(function(items){
        items.forEach(function(item){
            if(sendItems.indexOf(item.info.id) > -1) {
                console.log(item.info.market_hash_name);
                offer.addTheirItem(item.info);
            }
        });
        offer.send(function(err, status){
            if(err)console.log(err.message);
            else Trade.createDepositOffer(offer.id, steamid, cb);
        });    
    });

}

userSchema.methods.getInventory = function(cb){
    
    this.model('User').findOne({steamid: this.steamid}).select('inventory').populate('inventory').exec(cb);
    
}

userSchema.methods.getCaseHistory = function(cb){
    CaseHistory.find({opener: this.steamid}).populate('case').populate('item').exec(cb);
}



userSchema.statics.getUserBySteamid = function(steamid, cb){
    this.findOne({steamid: steamid}, 'steamid balance inventory').populate('inventory').exec(cb);
}


const User = mongoose.model('User', userSchema);

module.exports = User;