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

caseSchema.statics.getCasesWithItems = function(cb){
    this.find().populate('items.item').exec(cb);
}

caseSchema.methods.open = function(steamid){
    User.findOne({steamid: steamid}, function(err, user){
        if(err)console.log(err.message);

        if(user.balance >= this.price){
            User.updateOne({steamid: user.steamid}, {balance: user.balance - this.price}, function(err, rawResponse){
                var chanceList = [];

                this.items.forEach(function(item){
                    for(var i = 0; i < item.chance; i++){
                        chanceList.push(item.item);
                    }
                });

                var wonItem = chanceList[Math.floor(Math.random() * chanceList.length)];
                
                if(!this.offical){
                    User.findOne({steamid: this.owner}, function(err, owner){
                        if(err) console.log(err.message);
                        var config = JSON.parse(fs.readFileSync(__dirname + '/../../config/cases.json'));
                        User.updateOne({steamid: owner.steamid}, {balance: owner.balance + this.price * config.ownerPercentage}, function(err, rawResponse){
                            console.log('Paid owner of case ' + this.price + config.ownerPercentage);
                        });
                    });
                }

                user.inventory.push(this);

                CaseHistory.writeHistory(steamid, wonItem, this, function(err, newHistory){
                    return {
                        succcess: true,
                        item: wonItem
                    }
                });
            });

        }else{
            return {
                succcess: false,
                message: 'Insufficent funds'
            }
        }


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