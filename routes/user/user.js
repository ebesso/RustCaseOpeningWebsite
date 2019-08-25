const express = require('express');
const router = express.Router();

function isAuthenticated(req, res, next){
    if(req.user)next();
    else res.redirect('/login');
}

router.use('/user', isAuthenticated);

router.use(require('./deposit'));
router.use(require('./profile'));


module.exports = router;