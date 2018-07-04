var mongoose = require('mongoose');
var Question = require('./Questions').Question;

var TestQuestionsSchema = new mongoose.Schema({
    question: {type: String, required: true},
    answers: {type: [String], required: true},
    correctAnswer: {type: String, required: true}
}, {
    discriminatorKey: 'type'
});

TestQuestionsSchema.methods.getQuestion = function () {
    return {
        id: this.id,
        type: this.type,
        header: this.header,
        question: this.question,
        answers: this.answers
    };
};

TestQuestionsSchema.methods.setQuestion = function (question) {
    this.header = question._header;
    this.difficulty = question._difficulty;
    this.maxCost = question._maxCost;
    this.autoCheck = true;
    this.question = question._question;
    this.answers = question._answers.map(function(item) {
        return item.content;
    });
    this.correctAnswer = this.answers[question._correctAnswerIdx - 1];
};

exports.TestQuestion = Question.discriminator('TestQuestion', TestQuestionsSchema);
