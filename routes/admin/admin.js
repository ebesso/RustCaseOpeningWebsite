const express = require('express');
const router = express.Router();

const Case = require('../../resources/models/case');
const Item = require('../../resources/models/item');

const fs = require('fs');

const config = JSON.parse(fs.readFileSync(__dirname + '/../../config/admin.json'));

router.use('/admin', isAdmin);

function isAdmin(req, res, next){
    if(req.user){
        if(req.user[0].steamid == config.steamid){
            next();
            return;
        }
    }
    res.sendStatus(403);
}

router.get('/admin', function(req, res){
    Case.getCasesWithItems(function(err, cases){
        res.render('panel', {cases: cases});
    });
});

router.get('/admin/download/items', function(req, res){
    Item.updateItems(function(err){
        if(err)res.send(err.message);
        else res.send('Items downloaded');
    });
});

router.use(require('./case'));

module.exports = router;