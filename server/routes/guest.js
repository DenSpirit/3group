var express = require('express');
var router = express.Router();
var userService = require('../services/userService');

router.get('/allowTest', function (req, res) {
    userService.checkGuest(req.query.id, function (err, guest) {
        if (err || !guest) return res.status(404).end();

        req.login(guest, function (err) {
            if (err) return res.status(404).end();

            //res.redirect('http://192.168.14.81:1507/#/runTest/user');
            res.redirect('http://localhost:3000/#/runTest/user');
        });
    });
});

module.exports = router;
