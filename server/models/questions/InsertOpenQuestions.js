var mongoose = require('mongoose');
var Question = require('./Questions').Question;

var InsertOpenQuestionSchema = new mongoose.Schema({
    questionParts: {type: [String], required: true}
}, {
    discriminatorKey: 'type'
});

InsertOpenQuestionSchema.methods.getQuestion = function () {
    return {
        id: this.id,
        type: this.type,
        header: this.header,
        questionParts: this.questionParts
    };
};

InsertOpenQuestionSchema.methods.setQuestion = function (question) {
    this.header = question._header;
    this.difficulty = question._difficulty;
    this.maxCost = question._maxCost;
    this.autoCheck = false;
    this.questionParts = question._question.map(function (item) {
        return item.content;
    });
};

exports.InsertOpenQuestions = Question.discriminator('InsertOpenQuestion', InsertOpenQuestionSchema);
