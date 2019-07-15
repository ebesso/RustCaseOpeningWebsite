const express = require('express');
const router = express.Router();

const User = require('../resources/models/user');

router.get('/', function(req, res){
    res.render('index');
});

module.exports = router;