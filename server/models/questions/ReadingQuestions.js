var mongoose = require('mongoose');
var Question = require('./Questions').Question;

var ReadingQuestionsSchema = new mongoose.Schema({
    text: {type: String, required: true},
    subQuestions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true}]
}, {
    discriminatorKey: 'type'
});

ReadingQuestionsSchema.methods.getQuestion = function () {
    return {
        id: this.id,
        type: this.type,
        header: this.header,
        text: this.text,
        subQuestions: this.subQuestions.map(function (item) {
           return item.id;
        })
    }

};

ReadingQuestionsSchema.methods.setQuestion = function (question) {
    this.header = question._header;
    this.difficulty = question._difficulty;
    this.autoCheck = false;
    this.text = question._text;
};

exports.ReadingQuestion = Question.discriminator('ReadingQuestion', ReadingQuestionsSchema);
