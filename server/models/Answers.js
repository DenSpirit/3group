var mongoose = require('mongoose');
var Question = require('./questions/Questions').Question;

var AnswerSchema = new mongoose.Schema({
    question: {type: mongoose.Schema.ObjectId, ref: 'Question', required: true},
    answer: {type: String},
    subAnswers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}],
    parent: {type: mongoose.Schema.Types.ObjectId, ref: 'Answer'},
    autoCheck: {type: Boolean, required: true, default: false},
    mark: {type: Number, default: 0}
});

AnswerSchema.methods.getAnswerId = function () {
    var subAnswersId = [];
    this.subAnswers.forEach(function (answer, answers) {
        if (!answer.autoCheck) {
            subAnswersId.push(answer.id);
        }
    });
    if (subAnswersId.length === 0 && this.subAnswers.length !== 0) {
        return null;
    } else {
        return {
            id: this.id,
            subAnswersId: subAnswersId
        };
    }
};

AnswerSchema.methods.getAnswer = function () {
    var answer;
    if(this.question.type === 'SpeechQuestion') {
        answer = '../../../temp/' + this.answer;
    }
    return {
        question: this.question.getQuestion(),
        answer: answer || this.answer
    }
};

exports.Answer = mongoose.model('Answer', AnswerSchema);
