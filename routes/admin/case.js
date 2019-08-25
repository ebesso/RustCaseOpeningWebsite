const express = require('express');
const router = express.Router();

const Case = require('../../resources/models/case');
const Item = require('../../resources/models/item');


router.get('/admin/create/case', function(req, res){

    Item.find({}, function(err, items){
        
        if(err){
            res.send(err.message);
            return;
        }

        res.render('createCase', {
            items: items,
            admin: true
        });
    });

});

router.post('/admin/create/case', function(req, res){
    var data = req.body;

    Case.createOfficalCase(data.name, data.price, data.image, data.items, function(err, newCase){
        if(err) res.send('Failed to create case');
        else res.send('Case has been created');        
    });
    
});

router.post('/admin/delete/case', function(req, res){
    var deleteLoop = new Promise((resolve, reject) => {
        req.body.cases.forEach(function(deleteCase, i){
            Case.deleteOne({name: deleteCase}, function(err){
                if(err){
                    res.send(err.message);
                    resolve();
                }else{
                    if(i == req.body.cases.length - 1) resolve();
                }

            });


        });
    });


    deleteLoop.then(() => {

        res.send('Deleted cases');

    });


});

module.exports = router;