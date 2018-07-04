var mongoose = require('mongoose');
var Notification = require('../models/Notifications').Notification;
var Test = require('../models/Tests').Test;
var Validator = require('../libs/requestValidator');
var testService = require('./testService');
var mailer = require('../libs/mailer');

module.exports.getNotifications = function (done) {
    new Validator()
        .checkItem('notifications', function (callback) {
            Notification.find().populate('user teacher').exec(callback);
        })
        .exec(function (res) {
            var response = [];
            res.notifications.forEach(function (notification) {
                response.push(notification.getNotification());
            });
            done(null, response);
        }, done, done);
};

module.exports.closeDoneNotification = function (notificationId, done) {
    new Validator()
        .checkItem('notification', function (callback) {
            Notification.findOne({_id: notificationId}, callback);
        })
        .exec(function (res) {
            res.notification.remove(function (err) {
                done(err);
            });
        }, done, done);
};

module.exports.declineRequestNotification = function (notificationId, testId, done) {
    new Validator()
        .checkItems({
            notification: function (callback) {
                Notification.findOne({_id: notificationId}).populate('user').exec(callback);
            },
            test: function (callback) {
                Test.findOne({_id: testId}, callback);
            }
        })
        .exec(function (res) {
            res.notification.remove();
            res.test.remove();
            mailer.sendMail(
                res.notification.user.email,
                'Test request',
                'Hello, ' + res.notification.user.firstName + ' ' + res.notification.user.lastName + '\n' +
                'Your test request was declined.' + '\n' +
                'With love from administration of TheTuga!'
            );
            done(null);
        }, done, done);
};

module.exports.acceptRequestNotification = function (notificationId, userId, teacherId, timeFrom, timeTo, done) {
    new Validator()
        .checkItems({
            notification: function (callback) {
                Notification.findOne({_id: notificationId, type: 'request'}, callback);
            },
            test: function (callback) {
                Test.findOne({user: userId, status: 'requested'}, callback);
            }
        })
        .exec(function (res) {
            res.notification.remove();
            testService.acceptTestRequest(res.test.id, teacherId, timeFrom, timeTo, done);
        }, done, done);
};

module.exports.createRequestNotification = function (userId, testId) {
    var notification = new Notification({
        type: 'request',
        user: userId,
        test: testId
    });
    notification.save();
};

module.exports.createDoneNotification = function (userId, teacherId, testId) {
    var notification = new Notification({
        type: 'done',
        user: userId,
        teacher: teacherId,
        test: testId
    });
    notification.save();
};
