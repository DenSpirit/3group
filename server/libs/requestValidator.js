var async = require('async');

function Validator() {
    this._tasks = [function (callback) {
        callback(null, {});
    }];
};

Validator.prototype.checkItem = function (itemName, item) {
    this._tasks.push(function (prev, callback) {
        if (!prev) return callback(null, null);

        item(function (err, res) {
            if (err) return callback(err);

            res == null ? prev = null : prev[itemName] = res;
            callback(null, prev);
        }, prev);

    });
    return this;
};

Validator.prototype.checkItems = function (items) {
    for (key in items) {
        this.checkItem(key, items[key]);
    }
    return this;
};

Validator.prototype.exec = function (success, empty, error) {
    try {
        async.waterfall(this._tasks, function (err, res) {
            try {
                err ? error(err) :
                    res ? success(res) : empty();
            } catch (err) {
                error(err);
            }
        });
    } catch (err) {
        error(err);
    }
};

module.exports = Validator;
