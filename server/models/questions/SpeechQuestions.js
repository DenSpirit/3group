var mongoose = require('mongoose');
var Question = require('./Questions').Question;

var SpeechQuestionsSchema = new mongoose.Schema({
    question: {type: String, required: true}
}, {
    discriminatorKey: 'type'
});

SpeechQuestionsSchema.methods.getQuestion = function () {
    return {
        id: this.id,
        type: this.type,
        header: this.header,
        question: this.question
    };
};

SpeechQuestionsSchema.methods.setQuestion = function (question) {
    this.header = question._header;
    this.difficulty = question._difficulty;
    this.maxCost = question._maxCost;
    this.autoCheck = false;
    this.question = question._question;
};

exports.SpeechQuestion = Question.discriminator('SpeechQuestion', SpeechQuestionsSchema);
