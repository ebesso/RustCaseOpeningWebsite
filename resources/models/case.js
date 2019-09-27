const mongoose = require('mongoose');

const User = require('./user');
const Item = require('./item');
const CaseHistory = require('./caseHistory');

const fs = require('fs');

var caseSchema = mongoose.Schema({

    name: String,

    owner: String,
    offical: Boolean,
    price: Number,
    featured: Boolean,
    
    items: [{

        item: {type: mongoose.Schema.Types.ObjectId, ref: 'Item'},
        chance: Number

    }],

    used: Number,
    lastUsed: Date,
    created: Date,
    image: String

});

caseSchema.statics.getCaseWithItems = function(name, cb){
    this.findOne({name: name}).populate('items.item').exec(cb);
}

caseSchema.statics.getCasesWithItems = function(cb){
    this.find().populate('items.item').exec(cb);
}

caseSchema.methods.open = function(user, cb){
    var currentCase = this;

    if(user.balance >= currentCase.price){
        user.balance -= currentCase.price;

        user.save(function(err, savedUser){

            if(err) return cb({'message': 'Failed'}, null);

            var chanceList = [];

            currentCase.items.forEach(function(item){
                for(var i = 0; i < item.chance; i++){
                    chanceList.push(item.item);
                }
            });

            var wonItem = chanceList[Math.floor(Math.random() * chanceList.length)];

            // if(!currentCase.offical){
            //     User.findOne({steamid: currentCase.owner}, function(err, owner){

            //         if(err){
            //             console.log(err.message);
            //             return cb(err, null);
            //         }

            //         var config = JSON.parse(fs.readFileSync(__dirname + '/../../config/cases.json'));
            //         User.updateOne({steamid: owner.steamid}, {balance: owner.balance + this.price * config.ownerPercentage}, function(err, rawResponse){
            //             console.log('Paid owner of case ' + this.price + config.ownerPercentage);
            //         });
            //     });
            // }

            user.inventory.push(wonItem);

            user.save(function(err, savedUser){

                if(err) console.log(err.message);

                // CaseHistory.writeHistory(user.steamid, wonItem, currentCase, function(err, newHistory){
                //     return cb(null, wonItem);
                // });
                
                return cb(null, wonItem);

            });     


        });

    }else{
        return cb({
            message: 'insufficent funds'
        }, null);
    }
}

caseSchema.statics.editCase = function(name, data, cb){


    var items = [];

    var itemLoop = new Promise((resolve, reject) => {
        data.items.forEach(caseItem => {
            Item.getItem(caseItem.name, function(err, itemInfo){
                if(err) console.log(err.message);
                items.push({
                    item: itemInfo,
                    chance: caseItem.chance
                });
                if(items.length == data.items.length) resolve();        
            });
        });

    });

    itemLoop.then(() => {
        data.items = items;
        Case.updateOne({name: name}, data, cb);    
    });
}

caseSchema.statics.createOfficalCase = function(name, price, image, items, cb){
    var newCase = new this({

        name: name,
        price: price,
        owner: 'admin',
        offical: true,
        featured: false,
        used: 0,
        lastUsed: null,
        created: Date.now(),
        image: image,
        
        items: []

    });

    var itemLoop = new Promise((resolve, reject) => {

        items.forEach(function(item){

            Item.getItem(item.name, function(err, itemInfo){
    
                newCase.items.push({
                    item: itemInfo,
                    chance: item.chance,
                });

                if(newCase.items.length == items.length) resolve();


            });


        });

    });

    itemLoop.then(() => {
        return newCase.save(cb);

    });


}

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;