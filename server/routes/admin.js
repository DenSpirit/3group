var express = require('express');
var router = express.Router();
var mdlwares = require('../libs/mdlwares');
var questionService = require('../services/questionService');
var userService = require('../services/userService');
var testService = require('../services/testService');
var notificationService = require('../services/notificationService');
var response = require('../libs/responseHelper');

router.use(mdlwares.isAdmin);

router.post('/new_teacher', function (req, res) {
    userService.addNewTeacher(req.body.firstName, req.body.lastName, req.body.email, response.emptyResponse(res));
});

router.post('/new_guest', function (req, res) {
    userService.addNewGuest(req.body.firstName, req.body.lastName, req.body.email, {
        teacher: req.body.teacherId, timeFrom: req.body.timeFrom, timeTo: req.body.timeTo
    }, response.emptyResponse(res));
});

router.post('/add_questions', function (req, res) {
    questionService.addQuestions(req.body);
    res.end();

});

router.post('/user_list', function (req, res) {
    userService.getUserList(req.body.n, req.body.searchFilter, response.dataResponse(res));
});

router.get('/teachers_list', function (req, res) {
    userService.getTeachersList(response.dataResponse(res));
});

router.get('/notifications', function (req, res) {
    notificationService.getNotifications(response.dataResponse(res));
});

router.post('/done_notification', function (req, res) {
    notificationService.closeDoneNotification(req.body.notificationId, response.emptyResponse(res));
});

router.post('/decline_request_notification', function (req, res) {
    notificationService.declineRequestNotification(req.body.notificationId, req.body.testId, response.emptyResponse(res));
});

router.post('/accept_request_notification', function (req, res) {
    notificationService.acceptRequestNotification(req.body.notificationId, req.body.userId,
        req.body.teacherId, req.body.timeFrom, req.body.timeTo, response.emptyResponse(res));
});

router.post('/assign_test', function (req, res) {
    testService.assignNewTest(req.body.userId, req.body.teacherId,
        req.body.timeFrom, req.body.timeTo, response.emptyResponse(res));
});


router.post('/user_history', function (req, res) {
    userService.getUserHistory(req.body.userId, response.dataResponse(res));
});

router.post('/test_history', function (req, res) {
    testService.getTestsHistory(req.body.userId, req.body.testIds, response.dataResponse(res));
});

router.post('/user_info', function (req, res) {
    userService.getUserInfo(req.body.userId, response.dataResponse(res));
});

module.exports = router;
