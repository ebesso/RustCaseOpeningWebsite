const mongoose = require('mongoose');


const Item = require('./item');
const Case = require('./case');


var historySchema = mongoose.Schema({

    opener: String,
    date: Date,
    item: {type: mongoose.Schema.Types.ObjectId, ref: 'Item'},
    case: {type: mongoose.Schema.Types.ObjectId, ref: 'Case'}

});


historySchema.statics.totalCasesOpened = function(cb){
    this.countDocuments({}, cb);
}

historySchema.statics.estimatedTotalRevenue = function(cb){
    this.find({}, function(err, histories){
        var revenue = 0;

        var loop = new Promise((resolve, reject) => {

            histories.forEach(function(history, i){
                revenue += history.case.price;
                if(i == histories.length) resolve();
            });

        });

        loop.then(() => {
            return cb(revenue);
        });
    });
}

historySchema.statics.estimatedTotalProfit = function(cb){
    this.find({}, function(err, histories){
        var profit = 0;

        var loop = new Promise((resolve, reject) => {

            histories.forEach(function(history, i){
                profit += (history.case.price - history.item.price);
                if(i == histories.length) resolve();
            });

        });

        loop.then(() => {
            return cb(profit);
        });
    });
}

historySchema.statics.estimatedDayRevenue = function(cb){
    this.find({date: new Date()}, function(err, histories){
        var revenue = 0;

        var loop = new Promise((resolve, reject) => {

            histories.forEach(function(history, i){
                revenue += history.case.price;
                if(i == histories.length) resolve();
            });

        });

        loop.then(() => {
            return cb(revenue);
        });
    });
}

historySchema.statics.estimatedDayProfit = function(cb){
    this.find({date: new Date()}, function(err, histories){
        var profit = 0;

        var loop = new Promise((resolve, reject) => {

            histories.forEach(function(history, i){
                profit += (history.case.price - history.item.price);
                if(i == histories.length) resolve();
            });

        });

        loop.then(() => {
            return cb(profit);
        });
    });
}

historySchema.statics.writeHistory = function(steamid, item, caseOpened, cb){

    this.create({

        opener: steamid,
        date: new Date(),
        item: item,
        case: caseOpened

    }, cb);
}

const CaseHistory = mongoose.model('CaseHistory', historySchema);

module.exports = CaseHistory;