const express = require('express');
const router = express.Router();

const User = require('../resources/models/user');
const Case = require('../resources/models/case');


router.get('/', function(req, res){
    Case.getCasesWithItems(function(err, cases){
        res.render('index', {cases: cases});
    });
});

module.exports = router;