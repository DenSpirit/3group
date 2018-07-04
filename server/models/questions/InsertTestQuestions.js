var mongoose = require('mongoose');
var Question = require('./Questions').Question;

var InsertTestQuestionSchema = new mongoose.Schema({
    questionParts: {type: [String], required: true},
    answers: {type: [String], required: true},
    correctAnswer: {type: String, required: true}
}, {
    discriminatorKey: 'type'
});

InsertTestQuestionSchema.methods.getQuestion = function () {
    return {
        id: this.id,
        type: this.type,
        header: this.header,
        questionParts: this.questionParts,
        answers: this.answers
    };
};

InsertTestQuestionSchema.methods.setQuestion = function (question) {
    this.header = question._header;
    this.difficulty = question._difficulty;
    this.maxCost = question._maxCost;
    this.autoCheck = true;
    this.questionParts = question._question.map(function (item) {
        return item.content;
    });
    this.answers = question._answers.map(function(item) {
        return item.content;
    });
    this.correctAnswer = this.answers[question._correctAnswerIdx - 1];
};

exports.InsertTestQuestion = Question.discriminator('InsertTestQuestion', InsertTestQuestionSchema);
