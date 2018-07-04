var express = require('express');
var router = express.Router();
var testService = require('../services/testService');
var answerService = require('../services/answerService');
var mdlwares = require('../libs/mdlwares');
var response = require('../libs/responseHelper');

router.use(mdlwares.isTeacher);

router.get('/tests', function (req, res) {
    testService.getTeachersTests(req.user.id, response.dataResponse(res));
});

router.post('/check_test', function (req, res) {
    testService.getAnswers(req.body.testId, response.dataResponse(res));
});

router.post('/check_answer', function (req, res) {
    answerService.getAnswerById(req.body.answerId, response.dataResponse(res));
});

router.post('/send_mark', function (req, res) {
    answerService.setMark(req.body.answerId, req.body.testId, req.body.mark, response.emptyResponse(res));
});

router.post('/end_test', function (req, res) {
    testService.completeTestChecking(req.user.id, req.body.testId, response.emptyResponse(res));
});

module.exports = router;
