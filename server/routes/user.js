var express = require('express');
var router = express.Router();
var testService = require('../services/testService');
var questionService = require('../services/questionService');
var answerService = require('../services/answerService');
var userService = require('../services/userService');
var response = require('../libs/responseHelper');

var mdlwares = require('../libs/mdlwares');

router.use(mdlwares.isTested);

router.get('/init_test', function (req, res) {
    testService.initTest(req.user.id, response.dataResponse(res));
});

router.post('/next_question', function (req, res) {
    questionService.getQuestion(req.user.id, req.body.testId, req.body.n, response.dataResponse(res));
});

router.post('/next_subquestion', function (req, res) {
    questionService.getSubquestion(req.user.id, req.body.testId, req.body.id, response.dataResponse(res));
});

router.post('/answer', function (req, res) {
    answerService.addAnswer(req.user.id, req.body.testId, req.body.questionId, req.body.answer, response.emptyResponse(res));
});

router.post('/subanswer', function (req, res) {
    answerService.addSubanswer(req.user.id, req.body.testId, req.body.questionId, req.body.answer, response.emptyResponse(res));
});

router.post('/end_test', function (req, res) {
    testService.finishTest(req.user.id, req.body.testId, response.emptyResponse(res));
});

router.use(mdlwares.isUser);

router.get('/test_info', function (req, res) {
    testService.getTestStatus(req.user.id, response.dataResponse(res));
});

router.get('/ask_test', function (req, res) {
    testService.requestTest(req.user.id, response.emptyResponse(res));
});

router.get('/history', function (req, res) {
    userService.getUserHistory(req.user.id, response.dataResponse(res));
});

router.post('/test_history', function (req, res) {
    testService.getTestsHistory(req.user.id, req.body.testIds, response.dataResponse(res));
});

module.exports = router;
