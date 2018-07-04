var passport = require('passport');

module.exports.login = function (req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    passport.authenticate('local', function (err, user) {
        if (user) {
            req.login(user, function (err) {
                return err ?
                    res.status(401).end() :
                    res.json({role: user.role, username: user.username,  email: user.email});
            });
        } else {
            return res.status(401).json(err);
        }
    })(req, res, next);
};

module.exports.logout = function (req, res) {
    req.logout();
    res.status(200).end();
};
