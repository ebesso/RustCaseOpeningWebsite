const mongoose = require('mongoose');

const SteamCommunity = require('steamcommunity');
const community = new SteamCommunity();

const fs = require('fs');
const request = require('request');

var itemSchema = mongoose.Schema({

    name: String,
    price: Number,
    image: String,

});

itemSchema.statics.updateItems = function (cb) {
    var ItemModel = this;
    community.marketSearch({ appid: '252490' }, function (steamErr, items) {

        if (steamErr) return cb(steamErr);

        else {
            items.forEach(function (item) {

                Item.find({ name: item.market_hash_name }, function (err, savedItem) {

                    if (savedItem.price != item.price) {
                        ItemModel.updateOne({ name: item.market_hash_name }, { price: item.price }, function (err, response) {
                            if (err) console.log(err.message);

                        });
                    }

                });

            });

        }

    });
}

itemSchema.statics.getItem = function (name, cb) {
    this.findOne({ name: name }, 'name price image', cb);
}

var Item = mongoose.model('Item', itemSchema);

module.exports = Item;