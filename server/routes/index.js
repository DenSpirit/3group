var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/authinfo', function (req, res) {
    res.json(
        req.user ? {
            username: req.user.username,
            role: req.user.role,
            email: req.user.email
        } : null
    );
});

module.exports = router;
