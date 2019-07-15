const mongoose = require('mongoose');

const SteamCommunity = require('steamcommunity');
const community = new SteamCommunity();

var itemSchema = mongoose.Schema({

    name: String,
    price: Number,
    image: String,

});

itemSchema.statics.updateItems = function(cb){
    var ItemModel = this;
    this.deleteMany({}, function(deleteErr){

        if(deleteErr) return cb(deleteErr);

        community.marketSearch({appid: '252490'}, function(steamErr, items){
        
            if(steamErr) return cb(steamErr);

            else{
                console.log('No steam error');
                items.forEach(function(item){
                    
                    ItemModel.create({
                        name: item.market_hash_name,
                        price: item.price,
                        image: item.image

                    }, function(err, newItem){
                        
                    });

                });

            }

        });

    });
}

itemSchema.statics.getItem = function(name, cb){
    this.findOne({name: name}, 'name price image', cb);
}

var Item = mongoose.model('Item', itemSchema);

module.exports = Item;